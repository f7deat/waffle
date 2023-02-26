using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.ExternalAPI.Google.Models;
using Waffle.ExternalAPI.Interfaces;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class BloggerViewComponent : ViewComponent
    {
        private readonly IWorkService _workService;
        private readonly IGoogleService _googleService;
        public BloggerViewComponent(IWorkService workService, IGoogleService googleService)
        {
            _workService = workService;
            _googleService = googleService;
        }

        public async Task<IViewComponentResult> InvokeAsync(Guid id)
        {
            var blogger = await _workService.GetAsync<Blogger>(id);
            if (blogger is null)
            {
                return View(Empty.DefaultView, new ErrorViewModel
                {
                    RequestId = id.ToString()
                });
            }
            var response = await _googleService.BloggerPostsAsync(blogger.BlogId, blogger.ApiKey, 10, Request.Query["pageToken"], Request.Query["labels"]);
            if (response is null || response.Items is null)
            {
                return View(Empty.DefaultView, new ErrorViewModel
                {
                    RequestId = id.ToString()
                });
            }
            return View("~/Views/Shared/Components/ListGroup/Default.cshtml", new ListGroup
            {
                Name = "Feed",
                Items = GetItems(response.Items, blogger.NormalizedName)
            });
        }

        private static IEnumerable<ListGroupItem> GetItems(List<BloggerItem> items, string? normalizedName)
        {
            foreach (var item in items)
            {
                yield return new ListGroupItem
                {
                    Link = new Link
                    {
                        Href = $"/blogspot/{normalizedName}{item.Path}",
                        Name = item.Title
                    }
                };
            }
        }
    }
}
