using Waffle.Entities.Affliates;
using Waffle.Models.Filters.Affiliates;
using Waffle.Models.Result;

namespace Waffle.Core.Interfaces.IService;

public interface IAffiliateService
{
    Task<DefResult> AddLinkAsync(AffiliateLink args);
    Task<DefResult> DeleteLinkAsync(Guid id);
    Task<object?> ListAsync(AffiliateFilterOptions filterOptions);
}
