using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.IServices.Shops;
using Waffle.Core.Options;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Entities.Ecommerces;

namespace Waffle.Pages.Product;

public class DetailsModel(ICatalogService catalogService, ApplicationDbContext context, IProductService productService, IOptions<SettingOptions> options) : DynamicPageModel(catalogService)
{
    private readonly ApplicationDbContext _context = context;
    private readonly IProductService _productService = productService;
    private readonly SettingOptions Options = options.Value;
    public ProductWorkItem? Editor;
    public IEnumerable<Catalog> Tags = [];
    public Guid ProductImage;
    public IEnumerable<Catalog> RelatedProducts = [];
    public Entities.Ecommerces.Product? Product;
    public string Theme = "Default";
    public IEnumerable<ProductLink> Links = [];

    public async Task<IActionResult> OnGetAsync()
    {
        var result = await _productService.GetByCatalogIdAsync(PageData.Id);
        Product = result.Data;
        if (Product is null) return NotFound();
        Tags = await _catalogService.ListTagByIdAsync(PageData.Id);
        Links = await _productService.GetLinksAsync(Product.Id);
        var component = await GetComponentsAsync();
        if (component.Count != 0)
        {
            Editor = component.FirstOrDefault(x => x.NormalizedName == nameof(Editor));
            ProductImage = component.FirstOrDefault(x => x.NormalizedName == nameof(ProductImage))?.Id ?? Guid.Empty;
        }
        Theme = Options.Theme;
        return Page();
    }

    private async Task<List<ProductWorkItem>> GetComponentsAsync()
    {
        var query = from a in _context.WorkItems
                    join b in _context.WorkContents on a.WorkId equals b.Id
                    join c in _context.Components on b.ComponentId equals c.Id
                    where a.CatalogId == PageData.Id && b.Active
                    orderby a.SortOrder
                    select new ProductWorkItem
                    {
                        Id = b.Id,
                        Name = b.Name,
                        NormalizedName = c.NormalizedName,
                        Arguments = b.Arguments
                    };
        return await query.ToListAsync();
    }

    public class ProductWorkItem
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string NormalizedName { get; set; } = default!;
        public string? Arguments { get; set; }
    }
}
