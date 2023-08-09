using System.Security.Claims;
using Waffle.Core.Interfaces.IService;

namespace Waffle.Core.Services;

public class CurrentUser : ICurrentUser
{
    private readonly IHttpContextAccessor _contextAccessor;
    public CurrentUser(IHttpContextAccessor contextAccessor)
    {

        _contextAccessor = contextAccessor;
    }

    public Guid GetId()
    {
        var userId = _contextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Guid.Empty;
        }
        return Guid.Parse(userId);
    }
}
