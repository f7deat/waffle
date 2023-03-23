using System.ComponentModel;

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
    }
}
