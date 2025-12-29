using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;

namespace Waffle.Core.Services;

public class RouteDataService : IRouteDataService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    public RouteDataService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string GetLocale()
    {
        var routeData = _httpContextAccessor.HttpContext?.GetRouteData();
        if (routeData is null) return "vi-VN";
        routeData.Values.TryGetValue(nameof(PageData), out var pageData);
        return (pageData as PageData)?.Locale ?? "vi-VN";
    }
}
