using Waffle.Core.Interfaces.IService;
using Waffle.ExternalAPI.Interfaces;
using Waffle.Models.Components.Specifications;

namespace Waffle.ViewComponents
{
    public class PostContentViewComponent : BaseViewComponent<PostContent>
    {
        private readonly IWordPressService _wordPressService;
        public PostContentViewComponent(IWorkService workService, IWordPressService wordPressService) : base(workService)
        {
            _wordPressService = wordPressService;
        }

        protected override async Task<PostContent> ExtendAsync(PostContent work)
        {
            switch (work.Type)
            {
                case PostContentType.BlockEditor:
                    ViewName = PostContentType.BlockEditor.ToString();
                    break;
                case PostContentType.WordPress:
                    var wordPress = await _wordPressService.GetPostAsync(work.WordPress.Domain, work.WordPress.Id);
                    work.Content = wordPress?.Content.Rendered ?? string.Empty;
                    break;
                case PostContentType.Blogspot:
                    break;
                default:
                    break;
            }
            return work;
        }
    }
}
