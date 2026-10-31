using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PayOS.Models.Webhooks;
using Waffle.Core.Foundations;
using Waffle.Core.IServices.Financials;

namespace Waffle.Controllers;

public class WalletController(IWalletService walletService, ILogger<WalletController> logger) : BaseController
{
    [AllowAnonymous]
    [HttpPost("payos/webhook")]
    public async Task<IActionResult> PayOSWebhookAsync([FromBody] Webhook webhook)
    {
        var result = await walletService.ProcessPayOSWebhookAsync(webhook);
        if (!result.Succeeded)
        {
            logger.LogWarning("PayOS webhook was rejected: {Message}", result.Message);
            return BadRequest(result);
        }

        return Ok(new { code = "00", desc = "success" });
    }
}
