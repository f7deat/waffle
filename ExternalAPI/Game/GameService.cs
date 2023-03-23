using Waffle.ExternalAPI.Interfaces;

namespace Waffle.ExternalAPI.Game
{
    public class GameService : IGameService
    {
        private readonly HttpClient _httpClient;
        public GameService(HttpClient httpClient)
        {

            _httpClient = httpClient;
        }
    }
}
