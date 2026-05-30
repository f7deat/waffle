namespace Waffle.Core.Services.Files.Args;

public class FileUpdateArgs
{
    public Guid? Id { get; set; }
    public string? Name { get; set; }
    public Guid? FolderId { get; set; }
}
