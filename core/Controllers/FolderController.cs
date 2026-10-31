using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Services.Files.Filters;
using Waffle.Entities.Files;

namespace Waffle.Controllers;

public class FolderController(IFolderService _folderService) : BaseController
{
    [HttpPost("add")]
    public async Task<IActionResult> AddAsync([FromBody] Folder args, [FromQuery] string locale = "vi-VN") => Ok(await _folderService.AddAsync(args, locale));

    [HttpGet("list")]
    public async Task<IActionResult> ListAsync([FromQuery] FolderFilterOptions filterOptions) => Ok(await _folderService.ListAsync(filterOptions));

    [HttpGet("tree")]
    public async Task<IActionResult> TreeAsync([FromQuery] string locale = "vi-VN", CancellationToken cancellationToken = default) =>
        Ok(new { data = await _folderService.TreeAsync(locale, cancellationToken) });

    [HttpPost("delete/{id}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id) => Ok(await _folderService.DeleteAsync(id));

    [HttpPost("update")]
    public async Task<IActionResult> UpdateAsync([FromBody] Folder args) => Ok(await _folderService.UpdateAsync(args));
}
