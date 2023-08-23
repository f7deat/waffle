using System.ComponentModel.DataAnnotations;

namespace Waffle.Models.Components;

[Display(Name = "WordPress Lister", ShortName = "wordpress-lister")]
public class WordPressLister
{
    public string Domain { get; set; } = default!;
    public int ApiVersion { get; set; }
}
