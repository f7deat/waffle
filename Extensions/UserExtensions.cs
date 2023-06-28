using System.Security.Claims;

namespace Waffle.Extensions
{
    public static class UserExtensions
    {
        public static Guid GetId(this ClaimsPrincipal claimsPrincipal)
        {
            var id = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(id))
            {
                return Guid.Empty;
            }
            return Guid.Parse(id);
        }
    }
}
