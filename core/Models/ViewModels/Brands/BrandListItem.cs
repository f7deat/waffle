namespace Waffle.Models.ViewModels.Brands;

/// <summary>Brand summary returned to the admin and storefront.</summary>
public sealed record BrandListItem(
    int Id,
    string Name,
    string NormalizedName,
    string? Description,
    string? Logo,
    bool IsActive,
    int ProductCount);
