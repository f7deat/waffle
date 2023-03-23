using Waffle.ExternalAPI.Facebook;
using Waffle.ExternalAPI.Game;
using Waffle.ExternalAPI.Google;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Telegram;
using Waffle.ExternalAPI.Wiki;

namespace Waffle.Extensions
{
    public static class AddHttpClientExtensions
    {
        public static void AddHttpClients(this IServiceCollection services)
        {
            services.AddHttpClient<IFacebookService, FacebookService>();
            services.AddHttpClient<IGameService, GameService>();
            services.AddHttpClient<IGoogleService, GoogleService>();
            services.AddHttpClient<ITelegramService, TelegramService>();
            services.AddHttpClient<IWikiService, WikiService>();
        }
    }
}
