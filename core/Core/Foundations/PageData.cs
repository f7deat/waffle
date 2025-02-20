using Newtonsoft.Json;
using Waffle.Entities;

namespace Waffle.Core.Foundations;

public class PageData : BaseEntity
{
    public string Name { get; set; } = default!;
    public string NormalizedName { get; set; } = default!;
    public string? Description { get; set; }
    public string? Thumbnail { get; set; }
    public string Locale { get; set; } = "vi-VN";
    public string? Category { get; set; }
    public CatalogType Type { get; set; }
    public int ViewCount { get; set; }
    public DateTime ModifiedDate { get; set; }
    public string Url { get; set; } = default!;
    public string? SettingString { get; set; }
    public DateTime CreatedDate { get; set; }
    public Guid? CreatedBy { get; set; }

    public CatalogSetting Setting
    {
        get
        {
            if (string.IsNullOrEmpty(SettingString))
            {
                return new();
            }
            return JsonConvert.DeserializeObject<CatalogSetting>(SettingString) ?? new();
        }
    }
    public Guid? ParentId { get; set; }
}
