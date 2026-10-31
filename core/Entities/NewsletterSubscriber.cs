using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Waffle.Entities;

[Index(nameof(Email), nameof(Locale), IsUnique = true)]
public class NewsletterSubscriber : BaseEntity
{
    [StringLength(256)]
    public string Email { get; set; } = default!;
    [StringLength(10)]
    public string Locale { get; set; } = "vi-VN";
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}
