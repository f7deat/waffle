namespace Waffle.Core.Services.Files.Results;

public sealed record FolderTreeItem(Guid Id, Guid? ParentId, string Name, List<FolderTreeItem> Children);
