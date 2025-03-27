namespace Waffle.Core.Services.Files.Args;

public class MutiUploadArgs
{
    public Guid? FolderId { get; set; }
    public List<IFormFile>? Files { get; set; }
}
