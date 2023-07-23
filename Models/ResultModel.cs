using Microsoft.AspNetCore.Identity;

namespace Waffle.Models;

public class PayloadResult<T> : IdentityResult
{
    public T? Data { get; set; }
    public IdentityError? Error { get; set; }
    public static PayloadResult<T> Payload(T data)
    {
        return new PayloadResult<T>
        {
            Succeeded = true,
            Data = data
        };
    }

    public static PayloadResult<T> Failed(IdentityError error) => new() { Succeeded = false, Error = error };
}
