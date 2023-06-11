﻿using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models.Components
{
    public class Header : BaseEntity
    {
        [JsonPropertyName("logo")]
        public string Logo { get; set; } = string.Empty;
        [JsonPropertyName("template")]
        public string Template { get; set; } = "Default";

        [JsonIgnore]
        public static readonly List<Option> Templates = new()
        {
            new Option { Label = "Default", Value= "~/Pages/Shared/Components/Header/Default.cshtml" },
            new Option { Label = "DLiTi", Value= "~/Pages/Shared/Components/Header/DLiTi.cshtml" }
        };

        [JsonIgnore]
        public bool IsAuthenticated { get; set; }
    }
}
