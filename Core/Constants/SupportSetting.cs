﻿using Waffle.Models.Components;
using Waffle.Models.Settings;

namespace Waffle.Core.Constants
{
    public class SupportSetting
    {
        public static IList<string> Values => new List<string>
        {
            nameof(GoogleTagManager),
            nameof(Blogger)
        };
    }
}
