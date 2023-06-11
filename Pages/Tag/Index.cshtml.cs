using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Models;
using Waffle.Models.Components;
using Waffle.Models.ViewModels;

namespace Waffle.Pages.Tag
{
    public class IndexModel : EntryPageModel
    {
        public IndexModel(ICatalogService catalogService) : base(catalogService) { }

        public ListGroup Tags = new();

        [BindProperty(SupportsGet = true)]
        public int Current { get; set; } = 1;

        public Pagination Pagination = new();
        public string? SearchTerm { get; set; }

        public async Task OnGetAsync()
        {
            var tags = await _catalogService.ListTagAsync(new BasicFilterOptions
            {
                Current = Current,
                PageSize = 20
            });
            Tags = new ListGroup
            {
                Name = PageData.Name,
                Items = GetItems(tags.Data ?? new List<TagListItem>()),
                HasBadge = true
            };
            Pagination = new Pagination
            {
                HasNextPage = tags.HasNextPage,
                HasPrevPage = tags.HasPreviousPage,
                Total = tags.Total,
                NextPageUrl = $"/tag?current={Current + 1}",
                PrevPageUrl = $"/tag?current={Current - 1}"
            };
        }

        private static List<ListGroupItem> GetItems(IEnumerable<TagListItem> tags)
        {
            var returnValue = new List<ListGroupItem>();
            foreach (var tag in tags)
            {
                returnValue.Add(new ListGroupItem
                {
                    Link = new Link
                    {
                        Href = $"/tag/{tag.NormalizedName}",
                        Name = tag.Name,
                    },
                    Badge = tag.PostCount,
                    Suffix = $"<span class=\"text-gray-500 text-sm\"> - {tag.ViewCount} <i class=\"fas fa-eye\"></i></span>"
                });
            }
            return returnValue;
        }
    }
}
