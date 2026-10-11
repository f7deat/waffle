using System.ComponentModel.DataAnnotations;

namespace Waffle.Models.ViewModels.Brands;

/// <summary>Brand fields accepted when creating or updating a brand.</summary>
public sealed record SaveBrandRequest
{
    public int Id { get; init; }

    [Required, StringLength(256)]
    public required string Name { get; init; }

    [StringLength(512)]
    public string? Description { get; init; }

    [StringLength(2048)]
    public string? Logo { get; init; }

    public bool IsActive { get; init; } = true;
}
