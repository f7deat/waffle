using Waffle.Core.Foundations.Models;
using Waffle.Core.Helpers;
using Waffle.Core.IRepositories;
using Waffle.Core.IServices;
using Waffle.Core.Services.Tags.Args;
using Waffle.Entities.Tags;

namespace Waffle.Core.Services.Tags;

public class TagService(ITagRepository _tagRepository) : ITagService
{
    public async Task<TResult> CreateAsync(TagCreateArgs args)
    {
        var normalizedName = SeoHelper.ToSeoFriendly(args.Name);
        if (await _tagRepository.IsExistsAsync(normalizedName)) return TResult.Failed("Tag with the same name already exists.");
        await _tagRepository.AddAsync(new Tag
        {
            Name = args.Name,
            NormalizedName = normalizedName
        });
        return TResult.Success;
    }
}
