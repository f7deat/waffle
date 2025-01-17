using System.Security.Cryptography;
using System.Text;

namespace Waffle.Core.Helpers;

public class EncryptHelper
{
    public static string MD5Create(string? input)
    {
        if (string.IsNullOrWhiteSpace(input)) return string.Empty;
        return string.Join("", from ba in MD5.HashData(Encoding.UTF8.GetBytes(input)) select ba.ToString("x2"));
    }
}
