using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Entities.Ecommerces;
using Waffle.Extensions;
using Waffle.ExternalAPI.Interfaces;

namespace Waffle.Pages.Products.Checkout;

public class IndexModel : EntryPageModel
{
    private readonly ITelegramService _telegramService;
    private readonly ILogger<IndexModel> _logger;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IOrderService _orderService;

    public IndexModel(ITelegramService telegramService, ILogger<IndexModel> logger, UserManager<ApplicationUser> userManager, ICatalogService catalogService, IOrderService orderService) : base(catalogService)
    {
        _telegramService = telegramService;
        _logger = logger;
        _userManager = userManager;
        _orderService = orderService;
    }

    [BindProperty(SupportsGet = true)]
    public string? PhoneNumber { get; set; }
    [BindProperty(SupportsGet = true)]
    public string? Name { get; set; }
    [BindProperty(SupportsGet = true)]
    public string? Address { get; set; }
    [BindProperty(SupportsGet = true)]
    public string? Note { get; set; }

    public List<Catalog> Products { get; set; } = new();

    public bool IsAuthenticated => User.Identity?.IsAuthenticated ?? false;

    public ApplicationUser? CurrentUser;

    public string? ErrorMessage { get; set; }

    public async Task OnGetAsync()
    {
        CurrentUser = await _userManager.GetUserAsync(User);
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (string.IsNullOrWhiteSpace(PhoneNumber))
        {
            ErrorMessage = "Vui lòng nhập số điện thoại!";
            return Page();
        }
        var count = await _orderService.CountAsync();
        var order = new Order
        {
            UserId = User.GetId(),
            CreatedDate = DateTime.Now,
            Note = Note,
            Status = OrderStatus.Open,
            Number = $"{count + 1}"
        };
        await _orderService.AddAsync(order);
        var message = $"Đơn hàng mới: #{order.Number}\nKhách hàng: {Name}\nSDT: {PhoneNumber}\nĐịa chỉ: {Address}\nNote: {Note}";
        await _telegramService.SendMessageAsync(message);
        return Redirect("/products/checkout/finish");
    }
}
