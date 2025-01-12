using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Text.Json;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Options;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models.Components;

namespace Waffle.Pages.Product.Categories;

public class DetailsModel : DynamicPageModel
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly IProductService _productService;
    private readonly SettingOptions Options;

    public DetailsModel(ICatalogService catalogService, ApplicationDbContext context, IConfiguration configuration, IProductService productService, IOptions<SettingOptions> options) : base(catalogService)
    {
        _context = context;
        _configuration = configuration;
        _productService = productService;
        Options = options.Value;
    }

    public ProductWorkItem? Editor;
    public IEnumerable<Catalog> Tags = new List<Catalog>();
    public Guid ProductImage;
    public AffiliateLink? AffiliateLink;
    public Entities.Ecommerces.Product? Product;
    public string Theme = "Default";

    public async Task<IActionResult> OnGetAsync()
    {
        Tags = await _catalogService.ListTagByIdAsync(PageData.Id);
        Product = await _productService.GetByCatalogIdAsync(PageData.Id);
        var component = await GetComponentsAsync();
        if (component.Any())
        {
            Editor = component.FirstOrDefault(x => x.NormalizedName == nameof(Editor));
            ProductImage = component.FirstOrDefault(x => x.NormalizedName == nameof(ProductImage))?.Id ?? Guid.Empty;
            var affiliateLink = component.FirstOrDefault(x => x.NormalizedName == nameof(AffiliateLink));
            if (affiliateLink != null && !string.IsNullOrEmpty(affiliateLink.Arguments))
            {
                AffiliateLink = JsonSerializer.Deserialize<AffiliateLink>(affiliateLink.Arguments);
            }
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
