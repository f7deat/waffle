using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;
using Waffle.Models.Components;

namespace Waffle.Pages.Wiki
{
    public class TryAnotherLanguageModel : PageModel
    {
        private readonly IWikiService _wikiService;
        public TryAnotherLanguageModel(IWikiService wikiService)
        {
            _wikiService = wikiService;
        }

        public List<ListGroup> ListGroups = new();

        public async Task<IActionResult> OnGetAsync(string id)
        {
            var response = await _wikiService.GetLangLinksAsync(id);
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
                        Name = langLink.Title ?? string.Empty
                    },
                });
            }
            return returnValue;
        }
    }
}
