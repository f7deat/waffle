using Waffle.ExternalAPI.Facebook;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Wiki;

namespace Waffle.Extensions
{
    public static class AddHttpClientExtensions
    {
        public static void AddHttpClients(this IServiceCollection services)
        {
            services.AddHttpClient<IFacebookService, FacebookService>();
            services.AddHttpClient<IWikiService, WikiService>();
        }
    }
}
