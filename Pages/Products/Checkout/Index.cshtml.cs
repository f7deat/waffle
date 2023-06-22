using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;

namespace Waffle.Pages.Products.Checkout
{
    public class IndexModel : PageModel
    {
        private readonly ICatalogService _catalogService;
        private readonly ITelegramService _telegramService;
        private readonly IAppSettingService _appService;
        private readonly ILogger<IndexModel> _logger;
        public IndexModel(ICatalogService catalogService, ITelegramService telegramService, IAppSettingService appService, ILogger<IndexModel> logger)
        {
            _catalogService = catalogService;
            _telegramService = telegramService;
            _appService = appService;
            _logger = logger;
        }

        [BindProperty(SupportsGet = true)]
        public List<Guid> ProductIds { get; set; } = new();
        [BindProperty(SupportsGet = true)]
        public Guid OrderId { get; set; }

        public List<Catalog> Products { get; set; } = new();

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
        }

        public async Task<IActionResult> OnPostAsync()
        {
            var telegram = await _appService.GetAsync<Telegram>(nameof(Telegram));
            if (telegram != null)
            {
                var message = $"Bạn có đơn hàng mới: {OrderId}";
                await _telegramService.SendMessageAsync(telegram.Token, telegram.ChatId, message);
            }
            return Redirect("/shop/thank");
        }
    }
}
