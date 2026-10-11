using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Services.Brands;
using Waffle.Entities.Ecommerces;
using Waffle.Models;
using Waffle.Models.ViewModels.Brands;

namespace Waffle.Core.Interfaces.IRepository;

public interface IBrandRepository : IAsyncRepository<Brand>
{
    Task<ListResult<BrandListItem>> ListAsync(BrandFilterOptions filterOptions, bool activeOnly);
    Task<BrandListItem?> GetActiveByNormalizedNameAsync(string normalizedName);
    Task<IEnumerable<object>> OptionsAsync(string? keywords);
    Task<bool> IsNameTakenAsync(string normalizedName, int id);
}
