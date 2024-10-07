using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace Waffle.Core.Helpers;

public class ComponentHelper
{
    public static string GetDisplayName<T>()
    {
        if (typeof(T)
          .GetCustomAttributes(typeof(DisplayNameAttribute), true)
          .FirstOrDefault() is DisplayNameAttribute displayName)
            return displayName.DisplayName;
        return nameof(T);
    }

    public static DisplayAttribute? GetNormalizedName(string normalizedName)
    {
        var component = Assembly.GetExecutingAssembly().GetTypes().FirstOrDefault(t => t.IsClass && t.Name == normalizedName);
        if (component is null) return default;
        return AttributeHelper.GetDisplay(component);
    }
}
