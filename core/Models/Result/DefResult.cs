using Microsoft.AspNetCore.Identity;
using Waffle.Core.Interfaces.IService;

namespace Waffle.Models.Result;

public class DefResult : IdentityResult
{
    private static string _message = string.Empty;
    public string Message => _message;

    public static DefResult Failed(string message)
    {
        var result = new DefResult { Succeeded = false };
        if (string.IsNullOrEmpty(message))
        {
            _message = message;
        }
        return result;
    }
}
