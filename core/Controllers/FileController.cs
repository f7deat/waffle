using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Extensions;
using Waffle.Foundations;
using Waffle.Models;

namespace Waffle.Controllers;

public class FileController(IWebHostEnvironment webHostEnvironment, ApplicationDbContext context, IFileService fileExplorerService) : BaseController
{
    private readonly IWebHostEnvironment _webHostEnvironment = webHostEnvironment;
    private readonly ApplicationDbContext _context = context;
    private readonly IFileService _fileService = fileExplorerService;

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
    public async Task<IActionResult> UploadAsync([FromForm] IFormFile? file)
    {
        try
        {
            if (file is null) return BadRequest("File not found!");
            var uploadPath = Path.Combine(_webHostEnvironment.WebRootPath, "files");
            var folder = Guid.NewGuid().ToString();
            var folderPath = Path.Combine(uploadPath, folder);
            if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);

            var filePath = Path.Combine(uploadPath, folder, file.FileName);

            using (var stream = System.IO.File.Create(filePath))
            {
                await file.CopyToAsync(stream);
            }
            var url = $"https://{Request.Host.Value}/files/{folder}/{file.FileName}";
            await _context.FileContents.AddAsync(new FileContent
            {
                Name = file.FileName,
                Size = file.Length,
                Type = file.ContentType,
                Url = url,
                UploadBy = User.GetId(),
                UploadDate = DateTime.Now
            });
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.ToString());
        }
    }

    [HttpPost("muti-upload")]
    public async Task<IActionResult> MultiUploadAsync([FromForm] List<IFormFile>? files)
    {
        try
        {
            if (files is null || files.Count == 0) return BadRequest("Files not found!");
            var uploadPath = Path.Combine(_webHostEnvironment.WebRootPath, "files");
            var folder = Guid.NewGuid().ToString();
            var folderPath = Path.Combine(uploadPath, folder);
            if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);
            var fileContents = new List<FileContent>();

            foreach (var file in files)
            {
                var filePath = Path.Combine(uploadPath, folder, file.FileName);
                using (var stream = System.IO.File.Create(filePath))
                {
                    await file.CopyToAsync(stream);
                }
                var url = $"https://{Request.Host.Value}/files/{folder}/{file.FileName}";
                fileContents.Add(new FileContent
                {
                    Name = file.FileName,
                    Size = file.Length,
                    Type = file.ContentType,
                    Url = url,
                    UploadBy = User.GetId(),
                    UploadDate = DateTime.Now
                });
            }
            await _context.FileContents.AddRangeAsync(fileContents);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                succecced = true,
                data = fileContents.Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.UploadDate,
                    x.Url,
                    x.Type,
                    x.Size,
                    x.UploadBy
                })
            });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.ToString());
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await _context.FileContents.FindAsync(id));

    [HttpGet("count")]
    public async Task<IActionResult> CountAsync() => Ok(await _fileService.CountAsync());

    [HttpGet("total-size")]
    public async Task<IActionResult> GetTotalSizeAsync() => Ok(await _fileService.GetTotalSizeAsync());
}
