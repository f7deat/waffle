using Waffle.Core.Foundations.Models;
using Waffle.Core.Services.Tags.Args;

namespace Waffle.Core.IServices;

public interface ITagService
{
    Task<TResult> CreateAsync(TagCreateArgs args);
}
