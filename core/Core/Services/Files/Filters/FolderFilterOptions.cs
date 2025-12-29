using Waffle.Models;

namespace Waffle.Core.Services.Files.Filters;

public class FolderFilterOptions : FilterOptions
{
    public Guid? ParentId { get; set; }
    public string? Name { get; set; }
}
