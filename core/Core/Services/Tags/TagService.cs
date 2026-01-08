using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Helpers;
using Waffle.Core.IRepositories;
using Waffle.Core.IServices;
using Waffle.Core.Services.Tags.Args;
using Waffle.Core.Services.Tags.Filters;
using Waffle.Entities.Tags;
using Waffle.Models;
using Waffle.Models.Components.Common;

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

    public async Task<TResult> DeleteAsync(Guid id)
    {
        var tag = await _tagRepository.FindAsync(id);
        if (tag is null) return TResult.Failed("Tag not found.");
        await _tagRepository.DeleteAsync(tag);
        return TResult.Success;
    }

    public Task<ListResult> GetArticlesByTagAsync(TagArticleFilterOptions filterOptions) => _tagRepository.GetArticlesByTagAsync(filterOptions);

    public async Task<TResult> GetAsync(Guid id)
    {
        var tag = await _tagRepository.FindAsync(id);
        if (tag is null) return TResult.Failed("Tag not found.");
        return TResult.Ok(tag);
    }

    public Task<ListResult> GetPlacesByTagAsync(TagPlaceFilterOptions filterOptions) => _tagRepository.GetPlacesByTagAsync(filterOptions);

    public async Task<TResult> GetRandomsAsync()
    {
        var tags = await _tagRepository.Queryable()
            .OrderBy(x => Guid.NewGuid())
            .Take(10)
            .ToListAsync();
        return TResult.Ok(tags);
    }

    public async Task<IEnumerable<Option>> GetTagOptionsAsync(SelectOptions selectOptions)
    {
        selectOptions.KeyWords = SeoHelper.ToSeoFriendly(selectOptions.KeyWords);
        return await _tagRepository.GetTagOptionsAsync(selectOptions);
    }

    public async Task<ListResult> ListAsync(TagFilterOptions filterOptions)
    {
        var query = _tagRepository.Queryable();

        if (!string.IsNullOrWhiteSpace(filterOptions.Name))
        {
            query = query.Where(x => x.Name.Contains(filterOptions.Name));
        }

        return await ListResult.Success(query.Cast<object>(), filterOptions);
    }

    public async Task<TResult> UpdateAsync(TagUpdateArgs args)
    {
        var tag = await _tagRepository.FindAsync(args.Id);
        if (tag is null) return TResult.Failed("Tag not found.");

        if (!string.IsNullOrWhiteSpace(args.Name))
        {
            tag.Name = args.Name;
            tag.NormalizedName = SeoHelper.ToSeoFriendly(args.Name);

            if (await _tagRepository.Queryable().AnyAsync(x => x.NormalizedName == tag.NormalizedName && x.Id != args.Id))
            {
                return TResult.Failed("Tag with the same name already exists.");
            }
        }

        await _tagRepository.UpdateAsync(tag);
        return TResult.Success;
    }
}
