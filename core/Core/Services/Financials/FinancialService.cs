using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations.Models;
using Waffle.Core.IServices.Financials;
using Waffle.Data;
using Waffle.Entities.Users;
using Waffle.Models;
using Waffle.Models.ViewModels.Financials;

namespace Waffle.Core.Services.Financials;

public class FinancialService(ApplicationDbContext context) : IFinancialService
{
    public async Task<TResult> GetOverviewAsync(DateTime? fromDate, DateTime? toDate)
    {
        var query = context.UserTopupTransactions.AsQueryable();
        query = ApplyDateRange(query, fromDate, toDate);

        var totalDeposit = await query.Where(x => x.Amount > 0).SumAsync(x => x.Amount);
        var totalWithdrawRaw = await query.Where(x => x.Amount < 0).SumAsync(x => x.Amount);
        var totalWithdraw = Math.Abs(totalWithdrawRaw);
        var now = DateTime.UtcNow;
        var todayStart = now.Date;
        var monthStart = new DateTime(now.Year, now.Month, 1);

        var todayDeposit = await query.Where(x => x.Amount > 0 && x.CreatedAt >= todayStart).SumAsync(x => x.Amount);
        var todayWithdraw = Math.Abs(await query.Where(x => x.Amount < 0 && x.CreatedAt >= todayStart).SumAsync(x => x.Amount));
        var monthDeposit = await query.Where(x => x.Amount > 0 && x.CreatedAt >= monthStart).SumAsync(x => x.Amount);
        var monthWithdraw = Math.Abs(await query.Where(x => x.Amount < 0 && x.CreatedAt >= monthStart).SumAsync(x => x.Amount));

        var overview = new FinancialOverviewViewModel
        {
            TotalDeposit = totalDeposit,
            TotalWithdraw = totalWithdraw,
            NetFlow = totalDeposit - totalWithdraw,
            TransactionCount = await query.CountAsync(),
            DepositCount = await query.CountAsync(x => x.Amount > 0),
            WithdrawCount = await query.CountAsync(x => x.Amount < 0),
            ActiveUserCount = await query.Select(x => x.UserId).Distinct().CountAsync(),
            CurrentBalanceTotal = await context.Users.SumAsync(x => x.Amount),
            TodayDeposit = todayDeposit,
            TodayWithdraw = todayWithdraw,
            ThisMonthDeposit = monthDeposit,
            ThisMonthWithdraw = monthWithdraw,
        };

        return TResult.Ok(overview);
    }

    public async Task<ListResult<FinancialTransactionViewModel>> GetTransactionsAsync(FinancialTransactionFilterOptions filterOptions)
    {
        var query = BuildTransactionQuery(filterOptions);
        return await ListResult<FinancialTransactionViewModel>.Success(query, filterOptions);
    }

    public async Task<ListResult<FinancialTransactionViewModel>> GetDepositsAsync(FinancialTransactionFilterOptions filterOptions)
    {
        filterOptions.Type = "deposit";
        var query = BuildTransactionQuery(filterOptions);
        return await ListResult<FinancialTransactionViewModel>.Success(query, filterOptions);
    }

    public async Task<ListResult<FinancialTransactionViewModel>> GetWithdrawsAsync(FinancialTransactionFilterOptions filterOptions)
    {
        filterOptions.Type = "withdraw";
        var query = BuildTransactionQuery(filterOptions);
        return await ListResult<FinancialTransactionViewModel>.Success(query, filterOptions);
    }

    public Task<TResult> DepositAsync(FinancialActionArgs args, Guid adminId)
    {
        return ChangeBalanceAsync(args.UserId, args.Amount, args.Note, adminId, "INV");
    }

    public Task<TResult> WithdrawAsync(FinancialActionArgs args, Guid adminId)
    {
        return ChangeBalanceAsync(args.UserId, -args.Amount, args.Note, adminId, "WD");
    }

    public async Task<object?> GetUserOptionsAsync(string? keyWords)
    {
        var query = context.Users.AsQueryable();

        if (!string.IsNullOrWhiteSpace(keyWords))
        {
            keyWords = keyWords.Trim().ToLower();
            query = query.Where(x =>
                (x.Name ?? string.Empty).ToLower().Contains(keyWords) ||
                (x.UserName ?? string.Empty).ToLower().Contains(keyWords) ||
                (x.Email ?? string.Empty).ToLower().Contains(keyWords));
        }

        return await query
            .OrderByDescending(x => x.CreatedAt)
            .Take(20)
            .Select(x => new
            {
                label = string.IsNullOrWhiteSpace(x.Name) ? x.UserName : x.Name,
                value = x.Id,
                email = x.Email,
                balance = x.Amount,
            })
            .ToListAsync();
    }

    private IQueryable<FinancialTransactionViewModel> BuildTransactionQuery(FinancialTransactionFilterOptions filterOptions)
    {
        var query = from t in context.UserTopupTransactions
                    join u in context.Users on t.UserId equals u.Id
                    join a in context.Users on t.CreatedBy equals a.Id into adminJoin
                    from admin in adminJoin.DefaultIfEmpty()
                    select new FinancialTransactionViewModel
                    {
                        Id = t.Id,
                        UserId = t.UserId,
                        UserName = string.IsNullOrWhiteSpace(u.Name) ? u.UserName : u.Name,
                        UserEmail = u.Email,
                        Amount = t.Amount,
                        AbsoluteAmount = Math.Abs(t.Amount),
                        TransactionType = t.Amount >= 0 ? "deposit" : "withdraw",
                        BalanceBefore = t.BalanceBefore,
                        BalanceAfter = t.BalanceAfter,
                        InvoiceNumber = t.InvoiceNumber,
                        Note = t.Note,
                        CreatedBy = t.CreatedBy,
                        CreatedByName = admin != null ? (admin.Name ?? admin.UserName) : null,
                        CreatedAt = t.CreatedAt,
                    };

        if (filterOptions.UserId.HasValue)
        {
            query = query.Where(x => x.UserId == filterOptions.UserId.Value);
        }

        var type = filterOptions.Type?.Trim().ToLower();
        if (type == "deposit")
        {
            query = query.Where(x => x.Amount > 0);
        }
        else if (type == "withdraw")
        {
            query = query.Where(x => x.Amount < 0);
        }

        if (filterOptions.FromDate.HasValue)
        {
            var from = filterOptions.FromDate.Value.Date;
            query = query.Where(x => x.CreatedAt >= from);
        }

        if (filterOptions.ToDate.HasValue)
        {
            var toExclusive = filterOptions.ToDate.Value.Date.AddDays(1);
            query = query.Where(x => x.CreatedAt < toExclusive);
        }

        if (!string.IsNullOrWhiteSpace(filterOptions.KeyWords))
        {
            var keyWords = filterOptions.KeyWords.Trim().ToLower();
            query = query.Where(x =>
                (x.UserName ?? string.Empty).ToLower().Contains(keyWords) ||
                (x.UserEmail ?? string.Empty).ToLower().Contains(keyWords) ||
                x.InvoiceNumber.ToLower().Contains(keyWords) ||
                (x.Note ?? string.Empty).ToLower().Contains(keyWords));
        }

        return query.OrderByDescending(x => x.CreatedAt);
    }

    private static IQueryable<UserTopupTransaction> ApplyDateRange(IQueryable<UserTopupTransaction> query, DateTime? fromDate, DateTime? toDate)
    {
        if (fromDate.HasValue)
        {
            var from = fromDate.Value.Date;
            query = query.Where(x => x.CreatedAt >= from);
        }

        if (toDate.HasValue)
        {
            var toExclusive = toDate.Value.Date.AddDays(1);
            query = query.Where(x => x.CreatedAt < toExclusive);
        }

        return query;
    }

    private async Task<TResult> ChangeBalanceAsync(Guid userId, decimal signedAmount, string? note, Guid createdBy, string invoicePrefix)
    {
        var amount = Math.Abs(signedAmount);
        if (amount <= 0)
        {
            return TResult.Failed("Số tiền phải lớn hơn 0.");
        }

        var user = await context.Users.FindAsync(userId);
        if (user is null)
        {
            return TResult.Failed("User not found!");
        }

        if (signedAmount < 0 && user.Amount < amount)
        {
            return TResult.Failed("Số dư không đủ để thực hiện rút tiền.");
        }

        await using var dbTransaction = await context.Database.BeginTransactionAsync();

        var balanceBefore = user.Amount;
        user.Amount += signedAmount;

        var transaction = new UserTopupTransaction
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Amount = signedAmount,
            BalanceBefore = balanceBefore,
            BalanceAfter = user.Amount,
            InvoiceNumber = $"{invoicePrefix}-{DateTime.UtcNow:yyyyMMddHHmmss}-{Random.Shared.Next(100, 999)}",
            Note = string.IsNullOrWhiteSpace(note) ? null : note.Trim(),
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow,
        };

        await context.UserTopupTransactions.AddAsync(transaction);
        await context.SaveChangesAsync();
        await dbTransaction.CommitAsync();

        return TResult.Ok(new
        {
            transaction.Id,
            transaction.InvoiceNumber,
            transaction.Amount,
            transaction.BalanceBefore,
            transaction.BalanceAfter,
            transaction.CreatedAt,
        });
    }
}
