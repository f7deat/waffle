using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities.Files;
using Waffle.Foundations;

namespace Waffle.Controllers;

public class FolderController(IFolderService folderService) : BaseController
{
    private readonly IFolderService _folderService = folderService;

    [HttpPost("add")]
    public async Task<IActionResult> AddAsync([FromBody] Folder args) => Ok(await _folderService.AddAsync(args));
}
