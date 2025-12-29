using Waffle.Core.Foundations.Models;
using Waffle.Entities.Affliates;
using Waffle.Models.Filters.Affiliates;

namespace Waffle.Core.IServices.Shops;

public interface IAffiliateService
{
    Task<TResult> AddLinkAsync(AffiliateLink args);
    Task<TResult> DeleteLinkAsync(Guid id);
    Task<object?> ListAsync(AffiliateFilterOptions filterOptions);
}
