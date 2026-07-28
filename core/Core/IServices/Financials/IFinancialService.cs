using Waffle.Core.Foundations.Models;
using Waffle.Core.Services.Financials;
using Waffle.Models;
using Waffle.Models.ViewModels.Financials;

namespace Waffle.Core.IServices.Financials;

public interface IFinancialService
{
    Task<TResult> GetOverviewAsync(DateTime? fromDate, DateTime? toDate);
    Task<ListResult<FinancialTransactionViewModel>> GetTransactionsAsync(FinancialTransactionFilterOptions filterOptions);
    Task<ListResult<FinancialTransactionViewModel>> GetDepositsAsync(FinancialTransactionFilterOptions filterOptions);
    Task<ListResult<FinancialTransactionViewModel>> GetWithdrawsAsync(FinancialTransactionFilterOptions filterOptions);
    Task<TResult> DepositAsync(FinancialActionArgs args, Guid adminId);
    Task<TResult> WithdrawAsync(FinancialActionArgs args, Guid adminId);
    Task<object?> GetUserOptionsAsync(string? keyWords);
}
