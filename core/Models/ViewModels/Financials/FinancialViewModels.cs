namespace Waffle.Models.ViewModels.Financials;

public class FinancialOverviewViewModel
{
    public decimal TotalDeposit { get; set; }
    public decimal TotalWithdraw { get; set; }
    public decimal NetFlow { get; set; }
    public int TransactionCount { get; set; }
    public int DepositCount { get; set; }
    public int WithdrawCount { get; set; }
    public int ActiveUserCount { get; set; }
    public decimal CurrentBalanceTotal { get; set; }
    public decimal TodayDeposit { get; set; }
    public decimal TodayWithdraw { get; set; }
    public decimal ThisMonthDeposit { get; set; }
    public decimal ThisMonthWithdraw { get; set; }
}

public class FinancialTransactionViewModel
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string? UserName { get; set; }
    public string? UserEmail { get; set; }
    public decimal Amount { get; set; }
    public decimal AbsoluteAmount { get; set; }
    public string TransactionType { get; set; } = "deposit";
    public decimal BalanceBefore { get; set; }
    public decimal BalanceAfter { get; set; }
    public string InvoiceNumber { get; set; } = default!;
    public string? Note { get; set; }
    public Guid CreatedBy { get; set; }
    public string? CreatedByName { get; set; }
    public DateTime CreatedAt { get; set; }
}
