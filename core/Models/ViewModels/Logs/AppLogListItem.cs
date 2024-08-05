using Waffle.Entities;

namespace Waffle.Models.ViewModels.Logs;

public class AppLogListItem : AppLog
{
    public string? UserName { get; set; }
    public string? CatalogName { get; set; }
}
