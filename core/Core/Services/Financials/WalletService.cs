using System.Security.Cryptography;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using PayOS;
using PayOS.Exceptions;
using PayOS.Models.V2.PaymentRequests;
using PayOS.Models.Webhooks;
using Waffle.Core.Foundations.Models;
using Waffle.Core.IServices.Financials;
using Waffle.Core.Services.Users;
using Waffle.Data;
using Waffle.Entities.Users;
using Waffle.Models;
using Waffle.Models.ViewModels.Financials;

namespace Waffle.Core.Services.Financials;

public class WalletService(
    ApplicationDbContext context,
    IDataProtectionProvider dataProtectionProvider,
    IConfiguration configuration,
    IWebHostEnvironment environment,
    ILogger<WalletService> logger) : IWalletService
{
    private readonly IDataProtector _accountProtector = dataProtectionProvider.CreateProtector("Waffle.Wallet.WithdrawalAccount.v1");

    public async Task<TResult> CreateTopupAsync(Guid userId, ProfileTopupArgs args)
    {
        if (args.Amount < 1000 || args.Amount > int.MaxValue || decimal.Truncate(args.Amount) != args.Amount)
        {
            return TResult.Failed("Số tiền nạp phải là số nguyên từ 1.000 đến 2.147.483.647 VND.");
        }

        var clientId = configuration["PayOS:ClientId"];
        var apiKey = configuration["PayOS:ApiKey"];
        var checksumKey = configuration["PayOS:ChecksumKey"];
        var frontendUrl = configuration["PayOS:FrontendBaseUrl"]?.TrimEnd('/');
        if (string.IsNullOrWhiteSpace(clientId) || string.IsNullOrWhiteSpace(apiKey) ||
            string.IsNullOrWhiteSpace(checksumKey) || !Uri.TryCreate(frontendUrl, UriKind.Absolute, out var frontendUri) ||
            (frontendUri.Scheme != Uri.UriSchemeHttps &&
                !(environment.IsDevelopment() && configuration.GetValue<bool>("PayOS:AllowInsecureFrontendUrl"))))
        {
            logger.LogError("PayOS is not configured with credentials and a secure frontend URL.");
            return TResult.Failed("Nạp tiền trực tuyến hiện chưa được cấu hình. Vui lòng liên hệ quản trị viên.");
        }
        if (args.Note?.Length > 512) return TResult.Failed("Nội dung nạp tiền không được vượt quá 512 ký tự.");

        var user = await context.Users.AsNoTracking().SingleOrDefaultAsync(x => x.Id == userId);
        if (user is null) return TResult.Failed("Không tìm thấy tài khoản.");

        var orderCode = RandomNumberGenerator.GetInt32(1_000_000_000, int.MaxValue);
        var payment = new WalletTopupPayment
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            OrderCode = orderCode,
            Amount = args.Amount,
            Note = string.IsNullOrWhiteSpace(args.Note) ? null : args.Note.Trim(),
            Status = "Pending",
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddMinutes(15),
        };
        context.WalletTopupPayments.Add(payment);
        await context.SaveChangesAsync();

        try
        {
            var client = new PayOSClient(clientId, apiKey, checksumKey);
            var result = await client.PaymentRequests.CreateAsync(new CreatePaymentLinkRequest
            {
                OrderCode = orderCode,
                Amount = decimal.ToInt32(args.Amount),
                Description = $"NAP{orderCode % 1_000_000:000000}",
                BuyerName = user.Name ?? user.UserName,
                BuyerEmail = user.Email,
                ReturnUrl = $"{frontendUri}/user/profile?walletTopup=return",
                CancelUrl = $"{frontendUri}/user/profile?walletTopup=cancel",
                ExpiredAt = new DateTimeOffset(payment.ExpiresAt).ToUnixTimeSeconds(),
            });

            if (string.IsNullOrWhiteSpace(result.CheckoutUrl))
            {
                logger.LogError("PayOS did not return a checkout URL for order {OrderCode}.", orderCode);
                return TResult.Failed("Không thể tạo liên kết thanh toán. Vui lòng thử lại.");
            }

            payment.PaymentLinkId = result.PaymentLinkId;
            payment.CheckoutUrl = result.CheckoutUrl;
            await context.SaveChangesAsync();

            return TResult.Ok(new
            {
                payment.OrderCode,
                payment.Amount,
                payment.Status,
                payment.CheckoutUrl,
                payment.ExpiresAt,
            });
        }
        catch (PayOSException exception)
        {
            logger.LogError(exception, "PayOS could not create a checkout link for order {OrderCode}.", orderCode);
            return TResult.Failed("Không thể kết nối cổng thanh toán. Vui lòng thử lại sau.");
        }
    }

    public async Task<TResult> GetTopupStatusAsync(Guid userId, int orderCode)
    {
        var payment = await context.WalletTopupPayments.AsNoTracking()
            .Where(x => x.UserId == userId && x.OrderCode == orderCode)
            .Select(x => new { x.OrderCode, x.Amount, x.Status, x.CreatedAt, x.PaidAt, x.ExpiresAt })
            .SingleOrDefaultAsync();

        if (payment is null) return TResult.Failed("Không tìm thấy giao dịch nạp tiền.");
        var status = payment.Status == "Pending" && payment.ExpiresAt < DateTime.UtcNow
            ? "Expired"
            : payment.Status;
        return TResult.Ok(new
        {
            payment.OrderCode,
            payment.Amount,
            Status = status,
            payment.CreatedAt,
            payment.PaidAt,
        });
    }

    public async Task<TResult> ProcessPayOSWebhookAsync(Webhook webhook)
    {
        var clientId = configuration["PayOS:ClientId"];
        var apiKey = configuration["PayOS:ApiKey"];
        var checksumKey = configuration["PayOS:ChecksumKey"];
        if (string.IsNullOrWhiteSpace(clientId) || string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(checksumKey))
        {
            logger.LogError("Cannot verify PayOS webhook because PayOS credentials are not configured.");
            return TResult.Failed("Cổng thanh toán chưa được cấu hình.");
        }

        WebhookData verifiedData;
        try
        {
            var client = new PayOSClient(clientId, apiKey, checksumKey);
            verifiedData = await client.Webhooks.VerifyAsync(webhook);
        }
        catch (WebhookException exception)
        {
            logger.LogWarning(exception, "Rejected an invalid PayOS webhook.");
            return TResult.Failed("Chữ ký webhook không hợp lệ.");
        }
        catch (PayOSException exception)
        {
            logger.LogError(exception, "Could not verify PayOS webhook.");
            return TResult.Failed("Không thể xác thực thông báo thanh toán.");
        }

        if (!string.Equals(verifiedData.Code, "00", StringComparison.Ordinal))
        {
            return TResult.Ok(new { processed = false });
        }

        await using var dbTransaction = await context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);
        var payment = await context.WalletTopupPayments
            .SingleOrDefaultAsync(x => x.OrderCode == verifiedData.OrderCode);
        if (payment is null)
        {
            logger.LogWarning("PayOS webhook referenced unknown order {OrderCode}.", verifiedData.OrderCode);
            return TResult.Failed("Không tìm thấy giao dịch thanh toán.");
        }

        if (payment.Status == "Paid")
        {
            await dbTransaction.CommitAsync();
            return TResult.Ok(new { processed = true, duplicate = true });
        }

        if (payment.Status != "Pending" || payment.Amount != verifiedData.Amount)
        {
            logger.LogWarning(
                "PayOS webhook amount or state mismatch for order {OrderCode}. Expected {ExpectedAmount}, received {ReceivedAmount}.",
                payment.OrderCode,
                payment.Amount,
                verifiedData.Amount);
            return TResult.Failed("Thông tin giao dịch không khớp.");
        }

        var user = await context.Users.SingleOrDefaultAsync(x => x.Id == payment.UserId);
        if (user is null) return TResult.Failed("Không tìm thấy tài khoản nhận tiền.");

        var balanceBefore = user.Amount;
        user.Amount += payment.Amount;
        payment.Status = "Paid";
        payment.PaidAt = DateTime.UtcNow;
        payment.ProviderReference = verifiedData.Reference;

        context.UserTopupTransactions.Add(new UserTopupTransaction
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Amount = payment.Amount,
            BalanceBefore = balanceBefore,
            BalanceAfter = user.Amount,
            InvoiceNumber = $"PAYOS-{payment.OrderCode}",
            Note = payment.Note,
            CreatedBy = user.Id,
            CreatedAt = DateTime.UtcNow,
        });

        await context.SaveChangesAsync();
        await dbTransaction.CommitAsync();
        return TResult.Ok(new { processed = true, duplicate = false });
    }

    public async Task<TResult> CreateWithdrawalAsync(Guid userId, ProfileWithdrawArgs args)
    {
        var accountNumber = args.AccountNumber?.Trim().Replace(" ", "", StringComparison.Ordinal);
        if (args.Amount < 1000 || decimal.Truncate(args.Amount) != args.Amount)
        {
            return TResult.Failed("Số tiền rút phải là số nguyên từ 1.000 VND trở lên.");
        }
        if (args.Note?.Length > 512) return TResult.Failed("Ghi chú không được vượt quá 512 ký tự.");

        if (string.IsNullOrWhiteSpace(args.BankName) || args.BankName.Trim().Length > 100 ||
            string.IsNullOrWhiteSpace(args.AccountHolder) || args.AccountHolder.Trim().Length > 128 ||
            string.IsNullOrWhiteSpace(accountNumber) || accountNumber.Length is < 6 or > 32 ||
            !accountNumber.All(char.IsDigit))
        {
            return TResult.Failed("Vui lòng kiểm tra tên ngân hàng, chủ tài khoản và số tài khoản.");
        }

        await using var dbTransaction = await context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);
        var user = await context.Users.SingleOrDefaultAsync(x => x.Id == userId);
        if (user is null) return TResult.Failed("Không tìm thấy tài khoản.");
        if (user.Amount < args.Amount) return TResult.Failed("Số dư khả dụng không đủ.");

        var balanceBefore = user.Amount;
        user.Amount -= args.Amount;
        var now = DateTime.UtcNow;
        var request = new WalletWithdrawalRequest
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Amount = args.Amount,
            BankName = args.BankName.Trim(),
            AccountHolder = args.AccountHolder.Trim(),
            ProtectedAccountNumber = _accountProtector.Protect(accountNumber),
            InvoiceNumber = $"WD-{now:yyyyMMddHHmmss}-{RandomNumberGenerator.GetInt32(100, 1000)}",
            Status = "Pending",
            Note = string.IsNullOrWhiteSpace(args.Note) ? null : args.Note.Trim(),
            CreatedAt = now,
        };

        context.WalletWithdrawalRequests.Add(request);
        context.UserTopupTransactions.Add(new UserTopupTransaction
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Amount = -args.Amount,
            BalanceBefore = balanceBefore,
            BalanceAfter = user.Amount,
            InvoiceNumber = request.InvoiceNumber,
            Note = request.Note,
            CreatedBy = userId,
            CreatedAt = now,
        });

        await context.SaveChangesAsync();
        await dbTransaction.CommitAsync();

        return TResult.Ok(new
        {
            request.Id,
            request.InvoiceNumber,
            request.Amount,
            request.Status,
            AvailableBalance = user.Amount,
            request.CreatedAt,
        });
    }

    public Task<ListResult<WalletWithdrawalRequestViewModel>> GetMyWithdrawalsAsync(Guid userId, BasicFilterOptions filterOptions)
    {
        return GetWithdrawalListAsync(filterOptions, userId, false);
    }

    public Task<ListResult<WalletWithdrawalRequestViewModel>> GetWithdrawalRequestsAsync(BasicFilterOptions filterOptions)
    {
        return GetWithdrawalListAsync(filterOptions, null, true);
    }

    public async Task<TResult> ReviewWithdrawalAsync(Guid withdrawalId, string action, Guid adminId, string? note)
    {
        var normalizedAction = action.Trim().ToLowerInvariant();
        if (normalizedAction is not ("approve" or "paid" or "reject"))
        {
            return TResult.Failed("Thao tác xử lý không hợp lệ.");
        }
        if (note?.Length > 512) return TResult.Failed("Ghi chú xử lý không được vượt quá 512 ký tự.");

        await using var dbTransaction = await context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);
        var request = await context.WalletWithdrawalRequests.SingleOrDefaultAsync(x => x.Id == withdrawalId);
        if (request is null) return TResult.Failed("Không tìm thấy yêu cầu rút tiền.");

        if (normalizedAction == "approve" && request.Status != "Pending")
        {
            return TResult.Failed("Chỉ có thể duyệt yêu cầu đang chờ xử lý.");
        }
        if (normalizedAction == "paid" && request.Status != "Approved")
        {
            return TResult.Failed("Chỉ có thể xác nhận chuyển khoản cho yêu cầu đã duyệt.");
        }
        if (normalizedAction == "reject" && request.Status is not ("Pending" or "Approved"))
        {
            return TResult.Failed("Yêu cầu này không thể bị từ chối.");
        }

        var now = DateTime.UtcNow;
        if (normalizedAction == "reject")
        {
            var user = await context.Users.SingleOrDefaultAsync(x => x.Id == request.UserId);
            if (user is null) return TResult.Failed("Không tìm thấy tài khoản nhận tiền.");

            var balanceBefore = user.Amount;
            user.Amount += request.Amount;
            context.UserTopupTransactions.Add(new UserTopupTransaction
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Amount = request.Amount,
                BalanceBefore = balanceBefore,
                BalanceAfter = user.Amount,
                InvoiceNumber = $"{request.InvoiceNumber}-REFUND",
                Note = "Hoàn tiền do yêu cầu rút bị từ chối",
                CreatedBy = adminId,
                CreatedAt = now,
            });
            request.Status = "Rejected";
        }
        else
        {
            request.Status = normalizedAction == "approve" ? "Approved" : "Paid";
        }

        request.AdminNote = string.IsNullOrWhiteSpace(note) ? null : note.Trim();
        request.ResolvedBy = adminId;
        request.UpdatedAt = now;
        await context.SaveChangesAsync();
        await dbTransaction.CommitAsync();

        return TResult.Ok(new { request.Id, request.Status, request.Amount, request.UpdatedAt });
    }

    private async Task<ListResult<WalletWithdrawalRequestViewModel>> GetWithdrawalListAsync(
        BasicFilterOptions filterOptions,
        Guid? userId,
        bool includeAccountNumber)
    {
        filterOptions.Current = Math.Max(1, filterOptions.Current);
        filterOptions.PageSize = Math.Clamp(filterOptions.PageSize, 1, 100);
        var query = context.WalletWithdrawalRequests.AsNoTracking().AsQueryable();
        if (userId.HasValue) query = query.Where(x => x.UserId == userId.Value);

        var total = await query.CountAsync();
        var requests = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((filterOptions.Current - 1) * filterOptions.PageSize)
            .Take(filterOptions.PageSize)
            .Join(
                context.Users.AsNoTracking(),
                request => request.UserId,
                user => user.Id,
                (request, user) => new { Request = request, User = user })
            .ToListAsync();

        var data = requests.Select(x => new WalletWithdrawalRequestViewModel
        {
            Id = x.Request.Id,
            UserId = x.Request.UserId,
            UserName = x.User.Name ?? x.User.UserName,
            UserEmail = x.User.Email,
            Amount = x.Request.Amount,
            BankName = x.Request.BankName,
            AccountHolder = x.Request.AccountHolder,
            AccountNumber = GetAccountNumber(x.Request.ProtectedAccountNumber, includeAccountNumber),
            InvoiceNumber = x.Request.InvoiceNumber,
            Status = x.Request.Status,
            Note = x.Request.Note,
            AdminNote = x.Request.AdminNote,
            CreatedAt = x.Request.CreatedAt,
            UpdatedAt = x.Request.UpdatedAt,
        }).ToList();

        return new ListResult<WalletWithdrawalRequestViewModel>(data, total, filterOptions);
    }

    private string GetAccountNumber(string protectedAccountNumber, bool includeAccountNumber)
    {
        var accountNumber = _accountProtector.Unprotect(protectedAccountNumber);
        return includeAccountNumber
            ? accountNumber
            : $"•••• {accountNumber.Substring(Math.Max(0, accountNumber.Length - 4))}";
    }
}
