using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities.Files;
using Waffle.Foundations;
using Waffle.Models.Filters.Folders;

namespace Waffle.Controllers;

public class FolderController(IFolderService _folderService) : BaseController
{
    [HttpPost("add")]
    public async Task<IActionResult> AddAsync([FromBody] Folder args, [FromQuery] string locale) => Ok(await _folderService.AddAsync(args, locale));

    [HttpGet("list")]
    public async Task<IActionResult> ListAsync([FromQuery] FolderFilterOptions filterOptions) => Ok(await _folderService.ListAsync(filterOptions));

    [HttpPost("delete/{id}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id) => Ok(await _folderService.DeleteAsync(id));

    [HttpPost("update")]
    public async Task<IActionResult> UpdateAsync([FromBody] Folder args) => Ok(await _folderService.UpdateAsync(args));
}
