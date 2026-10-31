using PayOS.Models.Webhooks;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Services.Users;
using Waffle.Models;
using Waffle.Models.ViewModels.Financials;

namespace Waffle.Core.IServices.Financials;

public interface IWalletService
{
    Task<TResult> CreateTopupAsync(Guid userId, ProfileTopupArgs args);
    Task<TResult> GetTopupStatusAsync(Guid userId, int orderCode);
    Task<TResult> ProcessPayOSWebhookAsync(Webhook webhook);
    Task<TResult> CreateWithdrawalAsync(Guid userId, ProfileWithdrawArgs args);
    Task<ListResult<WalletWithdrawalRequestViewModel>> GetMyWithdrawalsAsync(Guid userId, BasicFilterOptions filterOptions);
    Task<ListResult<WalletWithdrawalRequestViewModel>> GetWithdrawalRequestsAsync(BasicFilterOptions filterOptions);
    Task<TResult> ReviewWithdrawalAsync(Guid withdrawalId, string action, Guid adminId, string? note);
}
