using Waffle.Entities;

namespace Waffle.Core.Services.Files.Models;

public class FileAndFolderListItem : BaseEntity
{
    public string Name { get; set; } = default!;
    public string Url { get; set; } = default!;
    public decimal Size { get; set; }
    public bool IsFolder { get; set; }
    public DateTime? CreatedDate { get; set; }
}
