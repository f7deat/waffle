﻿using System.ComponentModel.DataAnnotations;

namespace Waffle.Entities.Files;

public class Folder : BaseEntity
{
    [StringLength(256)]
    public string Name { get; set; } = default!;
    [StringLength(256)]
    public string NormalizedName { get; set; } = default!;
    public DateTime CreatedDate { get; set; }
    public Guid? ParentId { get; set; }
    public DateTime? ModifiedDate { get; set; }
    public Guid CreatedBy { get; set; }
    public Guid? ModifiedBy { get; set; }
    [StringLength(10)]
    public string Locale { get; set; } = default!;

    public virtual ICollection<FileContent>? Files { get; set; }
}
