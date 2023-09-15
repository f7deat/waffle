using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations.PageModels;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Extensions;
using Waffle.ExternalAPI.Interfaces;

namespace Waffle.Pages.Products.Checkout;

public class IndexModel : CheckoutPageModel
{
    private readonly ICatalogService _catalogService;
    private readonly ITelegramService _telegramService;
    private readonly ILogger<IndexModel> _logger;
    private readonly UserManager<ApplicationUser> _userManager;

    public IndexModel(ICatalogService catalogService, ITelegramService telegramService, ILogger<IndexModel> logger, UserManager<ApplicationUser> userManager)
    {
        _catalogService = catalogService;
        _telegramService = telegramService;
        _logger = logger;
        _userManager = userManager;
    }

    [BindProperty(SupportsGet = true)]
    public List<Guid> ProductIds { get; set; } = new();
    [BindProperty(SupportsGet = true)]
    public Guid OrderId { get; set; }
    [BindProperty(SupportsGet = true)]
    public string? PhoneNumber { get; set; }

    public List<Catalog> Products { get; set; } = new();

    public bool IsAuthenticated => User.Identity?.IsAuthenticated ?? false;

    public ApplicationUser? CurrentUser;

    public string? ErrorMessage { get; set; }

    public async Task OnGetAsync()
    {
        foreach (var productId in ProductIds)
        {
            var product = await _catalogService.FindAsync(productId);
            if (product != null)
            {
                Products.Add(product);
            }
        }
        CurrentUser = await _userManager.GetUserAsync(User);
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (string.IsNullOrWhiteSpace(PhoneNumber))
        {
            ErrorMessage = "Vui lòng nhập số điện thoại!";
            return Page();
        }
        var message = $"Bạn có đơn hàng mới: {OrderId}";
        await _telegramService.SendMessageAsync(message);
        var thankPage = await _catalogService.EnsureDataAsync("thank", CatalogType.Default);
        var url = thankPage.GetUrl();
        _logger.LogInformation("Đặt hàng thành công!");
        return Redirect(url);
    }
}
