namespace Waffle.Models.Catalogs
{
    public class Setting
    {
        public Setting()
        {
            TitleSuffix = string.Empty;
            GoogleTagManagerId = string.Empty;
        }
        public string TitleSuffix { get; set; }
        public string GoogleTagManagerId { get; set; }
    }
}
