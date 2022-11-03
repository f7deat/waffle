using Waffle.Entities;

namespace Waffle.Models
{
    public class PageVewModel : Catalog
    {
        public PageVewModel()
        {
            ComponentListItems = new List<ComponentListItem>();
            Settings = new PageSettingViewModel();
        }
        public List<ComponentListItem> ComponentListItems { get; set; }
        public PageSettingViewModel Settings { get; set; }
    }

    public class PageSettingViewModel
    {
        public bool Container { get; set; }
    }
}
