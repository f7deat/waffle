namespace Waffle.Core.Helpers;

public class EmailHelper
{
    public static bool IsValid(string email)
    {
        if (string.IsNullOrWhiteSpace(email)) return false;

        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }
}
