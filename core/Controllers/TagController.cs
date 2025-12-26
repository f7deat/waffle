using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.IServices;
using Waffle.Core.Services.Tags.Args;

namespace Waffle.Controllers;

public class TagController(ITagService _tagService) : BaseController
{
    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] TagCreateArgs args) => Ok(await _tagService.CreateAsync(args));

    [HttpGet]
    public async Task<IActionResult> ListAsync() => Ok(await _tagService.ListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAsync(Guid id) => Ok(await _tagService.GetAsync(id));

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAsync(Guid id, [FromBody] TagUpdateArgs args) => Ok(await _tagService.UpdateAsync(id, args));

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsync(Guid id) => Ok(await _tagService.DeleteAsync(id));

    [HttpGet("random")]
    public async Task<IActionResult> GetRandomAsync() => Ok(await _tagService.GetRandomAsync());
}
