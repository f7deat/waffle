using Waffle.Models;

namespace Waffle.Core.Services.Financials;

public record FinancialActionArgs(Guid UserId, decimal Amount, string? Note);

public class FinancialTransactionFilterOptions : FilterOptions
{
    public Guid? UserId { get; set; }
    public string? Type { get; set; }
    public string? KeyWords { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}
