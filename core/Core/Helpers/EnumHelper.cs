namespace Waffle.Core.Helpers;

public static class EnumHelper
{
    public static List<T> EnumToList<T>() where T : Enum
    {
        return Enum.GetValues(typeof(T)).Cast<T>().ToList();
    }
}
