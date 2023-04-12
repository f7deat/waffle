using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.ExternalAPI.Interfaces;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class WordPressPostViewComponent : ViewComponent
    {
        private readonly IWordPressService _wordPressService;
        private readonly IWorkService _workService;
        public WordPressPostViewComponent(IWordPressService wordPressService, IWorkService workService)
        {
            _wordPressService = wordPressService;
            _workService = workService;
        }

        public async Task<IViewComponentResult> InvokeAsync(Guid workId)
        {
            var config = await _workService.GetAsync<WordPressPostComponent>(workId);
            if (config is null)
            {
                return View(Empty.DefaultView, new ErrorViewModel
                {
                    RequestId = workId.ToString()
                });
            }

            var post = await _wordPressService.GetPostAsync(config.Domain, config.Id);
            if (post is null)
            {
                return View(Empty.DefaultView, new ErrorViewModel
                {
                    RequestId = $"{config.Domain}:{config.Id}"
                });
            }

            return View(post);
        }
    }
}
