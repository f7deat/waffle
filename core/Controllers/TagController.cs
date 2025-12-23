using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.IServices;
using Waffle.Core.Services.Tags.Args;

namespace Waffle.Controllers;

public class TagController(ITagService _tagService) : BaseController
{
    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] TagCreateArgs args) => Ok(await _tagService.CreateAsync(args));
}
