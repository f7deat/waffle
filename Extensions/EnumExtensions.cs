using System.ComponentModel;

namespace Waffle.Extensions;

public static class EnumExtensions
{
    public static string GetDescription(this Enum value)
    {
        var field = value.GetType().GetField(value.ToString());
        if (field is null) return value.ToString();
        var attribute = Attribute.GetCustomAttribute(field, typeof(DescriptionAttribute));
        return (attribute as DescriptionAttribute)?.Description ?? value.ToString();
    }
}
