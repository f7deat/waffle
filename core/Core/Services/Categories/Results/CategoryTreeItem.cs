using Waffle.Entities.Settings;

namespace Waffle.Core.Services.Categories.Results;

/// <summary>Represents a category and its nested child categories.</summary>
public sealed record CategoryTreeItem(
    int Id,
    string Name,
    string? Description,
    string? NormalizedName,
    int? ParentId,
    CategoryType Type,
    string Locale,
    List<CategoryTreeItem> Children);
