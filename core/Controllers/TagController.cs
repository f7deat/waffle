using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.IServices;
using Waffle.Core.Services.Tags.Args;
using Waffle.Core.Services.Tags.Filters;

namespace Waffle.Controllers;

public class TagController(ITagService _tagService) : BaseController
{
    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] TagCreateArgs args) => Ok(await _tagService.CreateAsync(args));

    [HttpGet]
    public async Task<IActionResult> ListAsync([FromQuery] TagFilterOptions filterOptions) => Ok(await _tagService.ListAsync(filterOptions));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAsync(Guid id) => Ok(await _tagService.GetAsync(id));

    [HttpPut]
    public async Task<IActionResult> UpdateAsync([FromBody] TagUpdateArgs args) => Ok(await _tagService.UpdateAsync(args));

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsync(Guid id) => Ok(await _tagService.DeleteAsync(id));

    [HttpGet("randoms")]
    public async Task<IActionResult> GetRandomsAsync() => Ok(await _tagService.GetRandomsAsync());
}
