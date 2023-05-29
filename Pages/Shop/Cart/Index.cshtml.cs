using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;

namespace Waffle.Pages.Shop.Cart
{
    public class IndexModel : PageModel
    {
        private readonly ICatalogService _catalogService;
        private readonly IOrderService _orderService;
        private readonly UserManager<ApplicationUser> _userManager;
        public IndexModel(ICatalogService catalogService, IOrderService orderService, UserManager<ApplicationUser> userManager)
        {
            _catalogService = catalogService;
            _orderService = orderService;
            _userManager = userManager;
        }

        [BindProperty(SupportsGet = true)]
        public Guid ProductId { get; set; }

        public Catalog Product = new();

        public async Task OnGetAsync()
        {
            Product = await _catalogService.FindAsync(ProductId) ?? new();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            var user = await _userManager.GetUserAsync(User);
            var order = new Order
            {
                UserId = user?.Id
            };
            await _orderService.AddAsync(order);
            return Redirect($"/shop/checkout?productIds={ProductId}");
        }
    }
}
