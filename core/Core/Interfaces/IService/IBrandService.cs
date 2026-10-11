using Waffle.Core.Foundations.Models;
using Waffle.Core.Services.Brands;
using Waffle.Models;
using Waffle.Models.ViewModels.Brands;

namespace Waffle.Core.Interfaces.IService;

public interface IBrandService
{
    Task<ListResult<BrandListItem>> ListAsync(BrandFilterOptions filterOptions, bool activeOnly);
    Task<IEnumerable<object>> OptionsAsync(string? keywords);
    Task<TResult> GetByNameAsync(string normalizedName);
    Task<TResult> CreateAsync(SaveBrandRequest request);
    Task<TResult> UpdateAsync(SaveBrandRequest request);
    Task<TResult> DeleteAsync(int id);
}
