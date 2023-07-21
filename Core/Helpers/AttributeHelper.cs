using System.ComponentModel.DataAnnotations;

namespace Waffle.Core.Helpers
{
    public class AttributeHelper
    {
        public static T? RetrieveCustomAttribute<T>(Type type) where T : Attribute
        {
            return Attribute.GetCustomAttribute(type, typeof(T)) as T;
        }

        public static string? GetName(Type type)
        {
            var attibute = RetrieveCustomAttribute<DisplayAttribute>(type);
            if (attibute == null) throw new Exception("Display not found!");
            return attibute.Name;
        }
    }
}
