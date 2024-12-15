namespace Waffle.Models.Filters.Folders;

public class FolderFilterOptions : FilterOptions
{
    public Guid? ParentId { get; set; }
    public string? Name { get; set; }
}
