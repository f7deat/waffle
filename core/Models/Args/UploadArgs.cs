﻿namespace Waffle.Models.Args;

public class UploadArgs
{
    public IFormFile? File { get; set; }
    public Guid? FolderId { get; set; }
}
