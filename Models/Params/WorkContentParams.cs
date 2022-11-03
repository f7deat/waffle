using Waffle.Entities;

namespace Waffle.Models.Params
{
    public class SaveWorkContentModel : WorkContent
    {
        public int SortOrder { get; set; }
        public Guid CatalogId { get; set; }
    }

    public class AddStyleModel
    {
        public AddStyleModel()
        {
            Name = string.Empty;
        }
        public Guid CatalogId { get; set; }
        public Guid WorkContentId { get; set; }
        public bool Active { get; set; }
        public string Name { get; set; }
    }

    public class AddWorkContentModel
    {
        public AddWorkContentModel()
        {
            Name = string.Empty;
        }
        public string Name { get; set; }
        public Guid CatalogId { get; set; }
        public Guid ComponentId { get; set; }
    }

    public class DeleteWorkContent
    {
        public Guid WorkContentId { get; set; }
        public Guid CatalogId { get; set; }
    }
}
