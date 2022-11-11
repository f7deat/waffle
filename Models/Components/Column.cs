using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models.Components
{
    public class Column : WorkContent
    {
        public Column()
        {
            WorkListItems = new List<WorkListItem>();
        }
        public Guid CatalogId { get; set; }
        public List<WorkListItem> WorkListItems { get; set; }
    }
}
