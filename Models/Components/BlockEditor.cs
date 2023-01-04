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
            Style = "ordered";
        }
        [JsonPropertyName("text")]
        public string? Text { get; set; }
        [JsonPropertyName("level")]
        public int? Level { get; set; }
        [JsonPropertyName("html")]
        public string? Html { get; set; }
        [JsonPropertyName("link")]
        public string? Link { get; set; }
        [JsonPropertyName("code")]
        public string? Code { get; set; }
        [JsonPropertyName("meta")]
        public BlockEditorMeta? Meta { get; set; }
        [JsonPropertyName("items")]
        public List<string>? Items { get; set; }
        [JsonPropertyName("style")]
        public string Style { get; set; }
        [JsonPropertyName("url")]
        public string? Url { get; set; }
        [JsonPropertyName("caption")]
        public string? Caption { get; set; }
    }

    public class BlockEditorMeta
    {
        [JsonPropertyName("title")]
        public string? Title { get; set; }
    }

    public class BlockEditorType {
        public const string PARAGRAPH = "paragraph";
        public const string HEADER = "header";
        public const string DELIMITER = "delimiter";
        public const string RAW = "raw";
        public const string LINK_TOOL = "linkTool";
        public const string CODE = "code";
        public const string LIST = "list";
        public const string SIMPLE_IMAGE = "simpleImage";
    }
}
