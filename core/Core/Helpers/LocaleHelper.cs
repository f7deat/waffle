﻿using System.Globalization;

namespace Waffle.Core.Helpers;

public class LocaleHelper
{
    public static bool IsAvailable(string? locale)
    {
        if (string.IsNullOrEmpty(locale)) return false;
        if (locale == "zh-CN") return true;
        return CultureInfo.GetCultures(CultureTypes.AllCultures).Any(x => x.Name == locale);
    }
}
