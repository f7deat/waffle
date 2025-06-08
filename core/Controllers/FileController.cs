using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Text.Json;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Options;
using Waffle.Core.Services.Files.Args;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Extensions;
using Waffle.ExternalAPI.Models;
using Waffle.Models;
using Waffle.Models.Args;

namespace Waffle.Controllers;

public class FileController(IWebHostEnvironment _webHostEnvironment, ApplicationDbContext _context, IFileService _fileService, IOptions<SettingOptions> options) : BaseController
{
    private readonly SettingOptions _options = options.Value;

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

    [HttpPost("upload"), AllowAnonymous]
    public async Task<IActionResult> UploadAsync([FromForm] UploadArgs args)
    {
        try
        {
            if (args.File is null) return BadRequest("File not found!");
            if (string.IsNullOrEmpty(_options.UploadAPIKey))
            {
                var folder = Guid.NewGuid().ToString();
                var uploadPath = Path.Combine(_webHostEnvironment.WebRootPath, "files", folder);
                if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);
                using (var stream = System.IO.File.Create(Path.Combine(uploadPath, args.File.FileName)))
                {
                    await args.File.CopyToAsync(stream);
                }

                return Ok(new
                {
                    success = 1,
                    url = $"https://{Request.Host.Value}/files/{folder}/{args.File.FileName}"
                });
            }
            var url = $"https://file.dhhp.edu.vn/api/file/upload?apiKey={_options.UploadAPIKey}";
            using var client = new HttpClient();
            var response = await client.PostAsync(url, new MultipartFormDataContent
            {
                { new StreamContent(args.File.OpenReadStream()), "file", args.File.FileName },
                { new StringContent("common"), "SiteCode" }
            });
            if (!response.IsSuccessStatusCode) return BadRequest("Upload failed!");
            var fileContent = await JsonSerializer.DeserializeAsync<FileUploadResponse>(await response.Content.ReadAsStreamAsync());
            if (fileContent is null) return BadRequest("Upload dserialize failed!");
            await _context.FileContents.AddAsync(new FileContent
            {
                Id = fileContent.Id,
                Name = args.File.FileName,
                Size = args.File.Length,
                Url = fileContent.Url,
                Type = args.File.ContentType,
                UploadDate = DateTime.Now,
                UploadBy = User.GetId()
            });
            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = 1,
                url = fileContent.Url
            });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.ToString());
        }
    }

    [HttpPost("3rd-upload")]
    public async Task<IActionResult> ThirdPartyUploadAsync([FromForm] UploadArgs args)
    {
        try
        {
            if (args.File is null) return BadRequest("File not found!");
            if (string.IsNullOrEmpty(_options.UploadAPIKey))
            {
                var folder = Guid.NewGuid().ToString();
                var uploadPath = Path.Combine(_webHostEnvironment.WebRootPath, "files", folder);
                if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);
                using (var stream = System.IO.File.Create(Path.Combine(uploadPath, args.File.FileName)))
                {
                    await args.File.CopyToAsync(stream);
                }

                return Ok(new
                {
                    success = 1,
                    url = $"https://{Request.Host.Value}/files/{folder}/{args.File.FileName}"
                });
            }
            var url = $"https://dhhp.edu.vn/api/file/upload?apiKey={_options.UploadAPIKey}";
            using var client = new HttpClient();
            var response = await client.PostAsync(url, new MultipartFormDataContent
            {
                { new StreamContent(args.File.OpenReadStream()), "file", args.File.FileName }
            });
            if (!response.IsSuccessStatusCode) return BadRequest("Upload failed!");
            var fileContent = await JsonSerializer.DeserializeAsync<FileUploadResponse>(await response.Content.ReadAsStreamAsync());
            if (fileContent is null) return BadRequest("Upload dserialize failed!");

            return Ok(new
            {
                success = 1,
                url = fileContent.Url
            });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.ToString());
        }
    }

    [HttpPost("muti-upload")]
    public async Task<IActionResult> MultiUploadAsync([FromForm] MutiUploadArgs args)
    {
        try
        {
            if (args.Files is null || args.Files.Count == 0) return BadRequest("Files not found!");
            var uploadPath = Path.Combine(_webHostEnvironment.WebRootPath, "files");
            var url = $"https://{Request.Host.Value}/files/";
            if (args.FolderId != null)
            {
                var folder = await _context.Folders.FindAsync(args.FolderId);
                if (folder is null) return BadRequest("Folder not found!");
                uploadPath = Path.Combine(uploadPath, folder.Name);
                url += folder.Name + "/";
            }
            if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);
            var fileContents = new List<FileContent>();

            foreach (var file in args.Files)
            {
                var filePath = Path.Combine(uploadPath, file.FileName);
                using (var stream = System.IO.File.Create(filePath))
                {
                    await file.CopyToAsync(stream);
                }
                url += file.FileName;
                fileContents.Add(new FileContent
                {
                    Name = file.FileName,
                    Size = file.Length,
                    Type = file.ContentType,
                    Url = url,
                    UploadBy = User.GetId(),
                    UploadDate = DateTime.Now,
                    FolderId = args.FolderId
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
