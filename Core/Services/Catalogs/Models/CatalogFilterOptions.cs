using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Core.Services.Catalogs.Models
{
    public class CatalogFilterOptions : FilterOptions
    {
        public CatalogFilterOptions()
        {
            Name = string.Empty;
        }
        public string Name { get; set; }
        public bool? Active { get; set; }
        public CatalogType Type { get; set; }
    }
}
