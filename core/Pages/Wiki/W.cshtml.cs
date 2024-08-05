using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;
using Waffle.Models.Components;

namespace Waffle.Pages.Wiki
{
    public class WModel : PageModel
    {
        private readonly IWikiService _wikiService;
        public WModel(IWikiService wikiService)
        {
            _wikiService = wikiService;
        }

        [BindProperty(SupportsGet = true)]
        public string? Title { get; set; }

        public List<ListGroup> ListGroups = new();
        public async Task<IActionResult> OnGetAsync()
        {
            if (Title == null)
            {
                return NotFound();
            }
            var response = await _wikiService.GetLangLinksAsync(Title);
            if (!response.Pages.Any())
            {
                return NotFound();
            }
            ViewData["Title"] = response.Pages.First().Title;
            ViewData["Description"] = response.Pages.First().Title;

            foreach (var page in response.Pages)
            {
                ListGroups.Add(new ListGroup
                {
                    Name = page.Title,
                    Items = GetItems(page.LangLinks)
                });
            }

            return Page();
        }

        private static List<ListGroupItem> GetItems(List<WikiLangLink> langLinks)
        {
            var returnValue = new List<ListGroupItem>();
            foreach (var langLink in langLinks)
            {
                returnValue.Add(new ListGroupItem
                {
                    Link = new Link
                    {
                        Href = langLink.Url,
                        Name = $"[{langLink.Lang}] {langLink.Title}"
                    },
                });
            }
            return returnValue;
        }
    }
}
