using System.Globalization;

namespace Waffle.Extensions;

public static class FormatExtensions
{
    public static string? ToMoney(this decimal? input)
    {
        var cul = new CultureInfo("vi-VN");
        return input?.ToString("C0", cul);
    }
}
