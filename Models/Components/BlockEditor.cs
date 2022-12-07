using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models.Components
{
    public class BlockEditor : BaseEntity
    {
        public BlockEditor()
        {
            Blocks = new List<BlockEditorBlock>();
        }
        [JsonPropertyName("blocks")]
        public List<BlockEditorBlock> Blocks { get; set; }
    }

    public class BlockEditorBlock
    {
        public BlockEditorBlock()
        {
            Id = string.Empty;
            Type = string.Empty;
            Data = new BlockEditorItemData();
        }
        [JsonPropertyName("id")]
        public string Id { get; set; }
        [JsonPropertyName("type")]
        public string Type { get; set; }
        [JsonPropertyName("data")]
        public BlockEditorItemData Data { get; set; }
    }

    public class BlockEditorItemData 
    {
        public BlockEditorItemData()
        {
            Text = string.Empty;
            Html = string.Empty;
        }
        [JsonPropertyName("text")]
        public string Text { get; set; }
        [JsonPropertyName("level")]
        public int? Level { get; set; }
        [JsonPropertyName("html")]
        public string Html { get; set; }
    }

    public class BlockEditorType {
        public const string PARAGRAPH = "paragraph";
        public const string HEADER = "header";
        public const string DELIMITER = "delimiter";
        public const string RAW = "raw";
    }
}
