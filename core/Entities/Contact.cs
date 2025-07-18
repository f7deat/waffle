﻿using System.ComponentModel.DataAnnotations;

namespace Waffle.Entities;

public class Contact : BaseEntity
{
    [StringLength(450)]
    public string Name { get; set; } = default!;
    [StringLength(450)]
    public string? Email { get; set; }
    [StringLength(20)]
    public string? PhoneNumber { get; set; }
    [StringLength(1000)]
    public string? Note { get; set; }
    [StringLength(500)]
    public string? Address { get; set; }
    public string? Meta { get; set; }
    public DateTime CreatedDate { get; set; }
}

public class ContactMeta
{
    public ContactMeta()
    {
        ErrorMessage = string.Empty;
    }
    public string ErrorMessage { get; set; }
}
