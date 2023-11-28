using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Foundations;
using Waffle.Models;

namespace Waffle.Controllers;

public class FileController : BaseController
{
    private readonly IWebHostEnvironment _webHostEnvironment;
    private readonly ApplicationDbContext _context;
    private readonly IFileService _fileService;

    public FileController(IWebHostEnvironment webHostEnvironment, ApplicationDbContext context, IFileService fileExplorerService)
    {
        _webHostEnvironment = webHostEnvironment;
        _context = context;
        _fileService = fileExplorerService;
    }

    [HttpGet("list")]
    public async Task<IActionResult> ListAsync([FromQuery] FileFilterOptions filterOptions) => Ok(await _fileService.ListAsync(filterOptions));

    [HttpPost("delete-file-content/{id}")]
    public async Task<IActionResult> DeleteFileContentAsync([FromRoute] Guid id)
    {
        var fileContent = await _fileService.FindAsync(id);
        if (fileContent is null) return BadRequest("File not found!");
        var path = Path.Combine(_webHostEnvironment.WebRootPath, "files", fileContent.Name);
        if (System.IO.File.Exists(path)) System.IO.File.Delete(path);
        _context.FileContents.Remove(fileContent);
        await _context.SaveChangesAsync();
        return Ok(IdentityResult.Success);
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadAsync([FromForm] IFormFile file)
    {
        if (file is null) return BadRequest("File not found!");
        if (!_webHostEnvironment.IsDevelopment())
        {
            return BadRequest("Production not supported!");
        }
        var uploadPath = Path.Combine(_webHostEnvironment.WebRootPath, "files");

        var filePath = Path.Combine(uploadPath, file.FileName);

        using (var stream = System.IO.File.Create(filePath))
        {
            await file.CopyToAsync(stream);
        }
        await _context.FileContents.AddAsync(new FileContent
        {
            Name = file.FileName,
            Size = file.Length,
            Type = file.ContentType,
            Url = $"/files/{file.FileName}"
        });
        await _context.SaveChangesAsync();
        return Ok(IdentityResult.Success);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await _context.FileContents.FindAsync(id));

    [HttpGet("count")]
    public async Task<IActionResult> CountAsync() => Ok(await _fileService.CountAsync());

    [HttpGet("total-size")]
    public async Task<IActionResult> GetTotalSizeAsync() => Ok(await _fileService.GetTotalSizeAsync());
}
