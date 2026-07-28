using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Constants;
using Waffle.Core.Foundations;
using Waffle.Core.IServices.Financials;
using Waffle.Core.Services.Financials;
using Waffle.Extensions;

namespace Waffle.Controllers;

[Authorize(Roles = RoleName.Admin)]
public class FinancialController(IFinancialService financialService) : BaseController
{
    [HttpGet("overview")]
    public async Task<IActionResult> OverviewAsync([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
        => Ok(await financialService.GetOverviewAsync(fromDate, toDate));

    [HttpGet("transaction")]
    public async Task<IActionResult> GetTransactionsAsync([FromQuery] FinancialTransactionFilterOptions filterOptions)
        => Ok(await financialService.GetTransactionsAsync(filterOptions));

    [HttpGet("deposit")]
    public async Task<IActionResult> GetDepositsAsync([FromQuery] FinancialTransactionFilterOptions filterOptions)
        => Ok(await financialService.GetDepositsAsync(filterOptions));

    [HttpGet("withdraw")]
    public async Task<IActionResult> GetWithdrawsAsync([FromQuery] FinancialTransactionFilterOptions filterOptions)
        => Ok(await financialService.GetWithdrawsAsync(filterOptions));

    [HttpPost("deposit")]
    public async Task<IActionResult> DepositAsync([FromBody] FinancialActionArgs args)
        => Ok(await financialService.DepositAsync(args, User.GetId()));

    [HttpPost("withdraw")]
    public async Task<IActionResult> WithdrawAsync([FromBody] FinancialActionArgs args)
        => Ok(await financialService.WithdrawAsync(args, User.GetId()));

    [HttpGet("user-options")]
    public async Task<IActionResult> UserOptionsAsync([FromQuery] string? keyWords)
        => Ok(await financialService.GetUserOptionsAsync(keyWords));
}
