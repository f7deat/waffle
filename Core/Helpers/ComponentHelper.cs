using System.ComponentModel;
using System.Reflection;
using Waffle.Models.Components;

namespace Waffle.Core.Helpers
{
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

        public static string GetNormalizedName(string name)
        {
            var component = Assembly.GetExecutingAssembly()
                .GetTypes()
                .FirstOrDefault(t => t.Namespace == "Waffle.Models.Components" && t.IsClass && t.Name == name);

            if (component is null) return name;

            var display = AttributeHelper.GetDisplay(component);
            return display?.GetPrompt() ?? name;
        }
    }
}
