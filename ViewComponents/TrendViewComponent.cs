using Microsoft.AspNetCore.Mvc;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models.GoogleAggregate;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class TrendViewComponent : ViewComponent
    {
        private readonly IGoogleService _googleService;
        public TrendViewComponent(IGoogleService googleService) => _googleService = googleService;

        public async Task<IViewComponentResult> InvokeAsync(Guid id) {
            var trend = await _googleService.GetDailyTrendingAsync();
            if (trend is null || trend.Channel is null || trend.Channel.Item is null)
            {
                return View(Empty.DefaultView, new ErrorViewModel
                {
                    RequestId = id.ToString()
                });
            }
            return View("~/Views/Shared/Components/ListGroup/Default.cshtml", new ListGroup
            {
                Name = "Daily Trending",
                Items = GetItems(trend.Channel.Item)
            });
        }

        private static IEnumerable<ListGroupItem> GetItems(List<ChannelItem> items)
        {
            foreach (var item in items)
            {
                yield return new ListGroupItem
                {
                    Link = new Link
                    {
                        Href = $"/search?searchTerm={item.Title}",
                        Name = item.Title ?? string.Empty
                    }
                };
            }
        }
    }
}
