namespace Waffle.Entities.Files;

public class Folder : BaseEntity
{
    public string Name { get; set; } = default!;
    public DateTime CreatedDate { get; set; }

    public List<FileContent>? Files { get; set; }
}
