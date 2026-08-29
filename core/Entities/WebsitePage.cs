using System.ComponentModel.DataAnnotations;

namespace Waffle.Entities;

public class WebsitePage : BaseEntity
{
    [Required, StringLength(100)]
    public string PageKey { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = "{\"version\":1,\"blocks\":[]}";

    public bool IsPublished { get; set; }
}