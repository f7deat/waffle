namespace Waffle.Models.ViewModels.Users;

public class UserTopupTransactionViewModel
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public decimal Amount { get; set; }
    public decimal BalanceBefore { get; set; }
    public decimal BalanceAfter { get; set; }
    public string InvoiceNumber { get; set; } = default!;
    public string? Note { get; set; }
    public Guid CreatedBy { get; set; }
    public string? CreatedByName { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class UserTopupStatsViewModel
{
    public Guid UserId { get; set; }
    public decimal CurrentBalance { get; set; }
    public decimal TotalTopup { get; set; }
    public decimal ThisMonthTopup { get; set; }
    public int TopupCount { get; set; }
    public DateTime? LastTopupAt { get; set; }
}

public class UserTopupInvoiceViewModel
{
    public Guid TransactionId { get; set; }
    public string InvoiceNumber { get; set; } = default!;
    public Guid UserId { get; set; }
    public string? UserName { get; set; }
    public string? UserEmail { get; set; }
    public decimal Amount { get; set; }
    public decimal BalanceBefore { get; set; }
    public decimal BalanceAfter { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid CreatedBy { get; set; }
    public string? CreatedByName { get; set; }
}
