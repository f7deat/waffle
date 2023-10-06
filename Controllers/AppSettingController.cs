using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Core.Interfaces;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;
using Waffle.Models.Components;
using Waffle.Models.Settings;
using Waffle.UnitTest;
using WFSendGrid = Waffle.ExternalAPI.SendGrids.SendGrid;

namespace Waffle.Controllers;

public class AppSettingController : BaseController
{
    private readonly ApplicationDbContext _context;
    private readonly IAppSettingService _appSettingService;
    private readonly IConfiguration _configuration;
    private readonly IFacebookService _facebookService;
    private readonly ITelegramService _telegramService;
    private readonly IWorkService _workService;
    private readonly IEmailSender _emailSender;

    public AppSettingController(IEmailSender emailSender, ApplicationDbContext context, IAppSettingService appSettingService, IConfiguration configuration, IFacebookService facebookService, ITelegramService telegramService, IWorkService workService)
    {
        _context = context;
        _appSettingService = appSettingService;
        _configuration = configuration;
        _facebookService = facebookService;
        _telegramService = telegramService;
        _workService = workService;
        _emailSender = emailSender;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await _appSettingService.GetAsync<object>(id));

    [HttpGet("list")]
    public async Task<IActionResult> ListAsync() => Ok(await _appSettingService.ListAsync());

    [HttpPost("save/{id}")]
    public async Task<IActionResult> SaveAsync([FromRoute] Guid id, [FromBody] object args) => Ok(await _appSettingService.SaveAsync(id, args));

    [HttpGet("info")]
    public IActionResult GetInfo()
    {
        return Ok(new
        {
            theme = _configuration.GetValue<string>("theme"),
            language = _configuration.GetValue<string>("language")
        });
    }

    [HttpGet("sendgrid")]
    public async Task<IActionResult> GetSendGridAsync()
    {
        var app = await _appSettingService.EnsureSettingAsync(nameof(SendGrid));
        return base.Ok(await _appSettingService.GetAsync<WFSendGrid>(app.Id));
    }

    [HttpPost("sendgrid/save")]
    public async Task<IActionResult> SaveSendGridAsync([FromBody] WFSendGrid args)
    {
        var app = await _appSettingService.EnsureSettingAsync(nameof(SendGrid));
        app.Value = JsonSerializer.Serialize(args);
        await _context.SaveChangesAsync();
        return Ok(IdentityResult.Success);
    }

    [HttpGet("layout/{id}")]
    public async Task<IActionResult> GetLayoutAsync([FromRoute] Guid id)
    {
        var setting = await _context.AppSettings.FindAsync(id);
        if (setting is null)
        {
            return Ok(IdentityResult.Failed());
        }
        var query = from a in _context.WorkItems
                    join b in _context.WorkContents on a.CatalogId equals setting.Id
                    where a.CatalogId == setting.Id
                    orderby a.SortOrder ascending
                    select b;
        return Ok(new
        {
            data = await query.ToListAsync(),
            total = await query.CountAsync()
        });
    }

    [HttpGet("facebook/{id}")]
    public async Task<IActionResult> FacebookGetAsync([FromRoute] Guid id) => Ok(await _appSettingService.GetAsync<Facebook>(id));

    [HttpPost("facebook/save")]
    public async Task<IActionResult> SaveFacebookAsync([FromBody] Facebook model)
    {
        var app = await _appSettingService.EnsureSettingAsync(nameof(Facebook));
        var facebook = await _appSettingService.GetAsync<Facebook>(app.Id);
        if (facebook != null)
        {
            var userToken = await _facebookService.GetLongLivedUserAccessTokenAsync(facebook.AppId, facebook.AppSecret, model.ShortLiveToken);
            if (userToken != null)
            {
                facebook.LongLivedUserAccessToken = userToken;
                var pageToken = await _facebookService.GetLongLivedPageAccessTokenAsync(facebook.PageId, facebook.LongLivedUserAccessToken.AccessToken);
                if (pageToken != null)
                {
                    facebook.PageAccessToken = pageToken.AccessToken;
                }
            }
            facebook.AppId = model.AppId;
            facebook.AppSecret = model.AppSecret;
            facebook.PageId = model.PageId;
        }
        else
        {
            facebook = model;
        }
        app.Value = JsonSerializer.Serialize(facebook);
        await _context.SaveChangesAsync();
        return Ok(IdentityResult.Success);
    }

    [HttpGet("long-lived-user-access-token")]
    public async Task<IActionResult> GetLongLivedUserAccessTokenAsync([FromQuery] string shortLiveToken)
    {
        var app = await _appSettingService.GetAsync<Facebook>(nameof(Facebook));
        if (app is null)
        {
            return NotFound();
        }
        return Ok(await _facebookService.GetLongLivedUserAccessTokenAsync(app.AppId, app.AppSecret, shortLiveToken));
    }

    [HttpPost("telegram/save/{id}")]
    public async Task<IActionResult> SaveTelegramAsync([FromRoute] Guid id, [FromBody] Telegram args) => Ok(await _appSettingService.SaveTelegramAsync(id, args));

    [HttpGet("telegram/{id}")]
    public async Task<IActionResult> GetTelegramAsync([FromRoute] Guid id) => Ok(await _appSettingService.GetAsync<Telegram>(id));

    [HttpPost("telegram/test")]
    public async Task<IActionResult> TestTelegramAsync([FromBody] TelegramMessage message)
    {
        var telegram = await _appSettingService.GetAsync<Telegram>(nameof(Telegram));
        if (telegram is null)
        {
            return Ok(IdentityResult.Failed(new IdentityError
            {
                Description = "Config not found"
            }));
        }
        var response = await _telegramService.SendMessageAsync(telegram.Token, telegram.ChatId, message.Message);
        return Ok(IdentityResult.Success);
    }

    [HttpGet("footer/{id}")]
    public async Task<IActionResult> GetFooterAsync([FromRoute] Guid id) => Ok(await _appSettingService.GetAsync<Footer>(id));

    [HttpPost("footer/save")]
    public async Task<IActionResult> SaveFooterAsync([FromBody] Footer args) => Ok(await _appSettingService.SaveFooterAsync(args));

    [HttpGet("social/{id}")]
    public async Task<IActionResult> GetSocialLinkAsync([FromRoute] Guid id) => Ok(await _appSettingService.GetAsync<Social>(id));

    [HttpPost("social/save")]
    public async Task<IActionResult> SaveSocialLinkAsync([FromBody] Social args)
    {
        var setting = await _appSettingService.EnsureSettingAsync(nameof(Social));
        setting.Value = JsonSerializer.Serialize(args);
        await _context.SaveChangesAsync();
        return Ok(IdentityResult.Success);
    }

    [HttpGet("sidebar")]
    public async Task<IActionResult> GetSidebarAsync()
    {
        var sidebar = await _appSettingService.EnsureSettingAsync(nameof(Sidebar));
        var components = await _workService.ListBySettingIdAsync(sidebar.Id);
        return Ok(components);
    }

    [HttpPost("test-send-mail")]
    public async Task<IActionResult> TestSendMailAsync([FromBody] EmailSenderMessageUnitTest args) => Ok(await _emailSender.SendEmailAsync(args.Email, args.Subject, args.Message));

    [HttpGet("graph-api-explorer")]
    public async Task<IActionResult> GraphAPIExplorerAsync([FromQuery] string query)
    {
        return Ok(await _facebookService.GraphAPIExplorerAsync(query));
    }
}
