using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Services.Files.Args;
using Waffle.Data;
using Waffle.Entities.Files;
using Waffle.Extensions;
using Waffle.Models;
using Waffle.Models.Settings;

namespace Waffle.Controllers;

public class FileController(IWebHostEnvironment _webHostEnvironment, ApplicationDbContext _context, IFileService _fileService, ISettingService _settingService) : BaseController
{
    private const long MaxImageSize = 10 * 1024 * 1024;
    private static readonly string[] SupportedImageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg"];

    [HttpGet("list")]
    public async Task<IActionResult> ListAsync([FromQuery] FileFilterOptions filterOptions) => Ok(await _fileService.ListAsync(filterOptions));

    [HttpPost("delete-file-content/{id}")]
    public async Task<IActionResult> DeleteFileContentAsync([FromRoute] Guid id)
    {
        var fileContent = await _fileService.FindAsync(id);
        if (fileContent is null) return BadRequest("File not found!");
        DeletePhysicalFile(fileContent);
        _context.FileContents.Remove(fileContent);
        await _context.SaveChangesAsync();
        return Ok(IdentityResult.Success);
    }

    [HttpGet("image-library")]
    public async Task<IActionResult> ImageLibraryAsync([FromQuery] FileFilterOptions filterOptions)
    {
        var query = _context.FileContents.AsNoTracking().Where(x => IsImageType(x.Type, x.Name));

        if (!string.IsNullOrWhiteSpace(filterOptions.Name))
        {
            query = query.Where(x => EF.Functions.Like(x.Name, $"%{filterOptions.Name}%"));
        }

        if (filterOptions.FolderId.HasValue)
        {
            query = query.Where(x => x.FolderId == filterOptions.FolderId);
        }

        return Ok(await ListResult.Success(query, filterOptions));
    }

    [HttpPost("images/upload")]
    public async Task<IActionResult> UploadImagesAsync([FromForm] MutiUploadArgs args)
    {
        try
        {
            if (args.Files is null || args.Files.Count == 0) return BadRequest("Images not found!");

            var (uploadPath, urlPrefix) = await ResolveUploadLocationAsync(args.FolderId);
            if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);

            var fileContents = new List<FileContent>();
            foreach (var file in args.Files)
            {
                if (!IsImageUpload(file)) return BadRequest($"{file.FileName} is not a valid image!");
                if (file.Length > MaxImageSize) return BadRequest($"{file.FileName} exceeds the limit of 10 MB.");

                var extension = Path.GetExtension(file.FileName);
                var saveName = $"{Guid.NewGuid():N}{extension}";
                var filePath = Path.Combine(uploadPath, saveName);

                using (var stream = System.IO.File.Create(filePath))
                {
                    await file.CopyToAsync(stream);
                }

                fileContents.Add(new FileContent
                {
                    Name = file.FileName,
                    Size = file.Length,
                    Type = file.ContentType,
                    Url = urlPrefix + saveName,
                    UploadBy = User.GetId(),
                    UploadDate = DateTime.UtcNow,
                    FolderId = args.FolderId
                });
            }

            await _context.FileContents.AddRangeAsync(fileContents);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                succeeded = true,
                data = fileContents.Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Url,
                    x.Type,
                    x.Size,
                    x.UploadDate,
                    x.FolderId
                })
            });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.ToString());
        }
    }

    [HttpDelete("image/{id}")]
    public async Task<IActionResult> DeleteImageAsync([FromRoute] Guid id)
    {
        var fileContent = await _context.FileContents.FindAsync(id);
        if (fileContent is null) return BadRequest("Image not found!");
        if (!IsImageType(fileContent.Type, fileContent.Name)) return BadRequest("File is not an image!");

        DeletePhysicalFile(fileContent);
        _context.FileContents.Remove(fileContent);
        await _context.SaveChangesAsync();
        return Ok(IdentityResult.Success);
    }

    [HttpPost("images/delete")]
    public async Task<IActionResult> DeleteImagesAsync([FromBody] DeleteImagesArgs args)
    {
        if (args.Ids.Count == 0) return BadRequest("Image ids are required!");

        var images = await _context.FileContents.Where(x => args.Ids.Contains(x.Id) && IsImageType(x.Type, x.Name)).ToListAsync();
        if (images.Count == 0) return BadRequest("Images not found!");

        foreach (var image in images)
        {
            DeletePhysicalFile(image);
        }

        _context.FileContents.RemoveRange(images);
        await _context.SaveChangesAsync();
        return Ok(new
        {
            succeeded = true,
            deleted = images.Count
        });
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadAsync([FromForm] UploadArgs args)
    {
        try
        {
            if (args.File is null) return BadRequest("File not found!");
            if (args.File.Length > 10 * 1024 * 1024) return BadRequest("File size exceeds the limit of 10 MB.");

            var uploadSetting = await _settingService.GetAsync<UploadSetting>(nameof(UploadSetting));
            if (uploadSetting is null) return BadRequest("Upload setting not found!");
            if (uploadSetting.Type == UploadSettingType.HPUNI) return Ok(await _fileService.UploadToHPUNIAsync(args.File));

            var folder = Guid.NewGuid().ToString();
            var uploadPath = Path.Combine(_webHostEnvironment.WebRootPath, "files", folder);

            if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);
            using (var stream = System.IO.File.Create(Path.Combine(uploadPath, args.File.FileName)))
            {
                await args.File.CopyToAsync(stream);
            }
            var url = $"{Request.Scheme}://{Request.Host.Value}/files/{folder}/{args.File.FileName}";

            var fileContent = new FileContent
            {
                Name = args.File.FileName,
                Size = args.File.Length,
                Type = args.File.ContentType,
                Url = url,
                UploadBy = User.GetId(),
                UploadDate = DateTime.Now,
                FolderId = args.FolderId
            };
            await _context.FileContents.AddAsync(fileContent);
            await _context.SaveChangesAsync();

            return Ok(TResult.Ok(fileContent.Url));
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
            var url = $"{Request.Scheme}://{Request.Host.Value}/files/";
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
                fileContents.Add(new FileContent
                {
                    Name = file.FileName,
                    Size = file.Length,
                    Type = file.ContentType,
                    Url = url + file.FileName,
                    UploadBy = User.GetId(),
                    UploadDate = DateTime.UtcNow,
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

    private async Task<(string uploadPath, string urlPrefix)> ResolveUploadLocationAsync(Guid? folderId)
    {
        var uploadPath = Path.Combine(_webHostEnvironment.WebRootPath, "files");
        var urlPrefix = $"{Request.Scheme}://{Request.Host.Value}/files/";

        if (!folderId.HasValue) return (uploadPath, urlPrefix);

        var folder = await _context.Folders.FindAsync(folderId);
        if (folder is null) throw new InvalidOperationException("Folder not found!");

        uploadPath = Path.Combine(uploadPath, folder.Name);
        urlPrefix += folder.Name + "/";
        return (uploadPath, urlPrefix);
    }

    private static bool IsImageUpload(IFormFile file)
    {
        if (file is null) return false;
        return IsImageType(file.ContentType, file.FileName);
    }

    private static bool IsImageType(string? contentType, string? fileName)
    {
        if (!string.IsNullOrWhiteSpace(contentType) && contentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }

        if (string.IsNullOrWhiteSpace(fileName)) return false;
        var extension = Path.GetExtension(fileName);
        return SupportedImageExtensions.Contains(extension, StringComparer.OrdinalIgnoreCase);
    }

    private void DeletePhysicalFile(FileContent fileContent)
    {
        var filePath = GetPhysicalFilePath(fileContent);
        if (System.IO.File.Exists(filePath))
        {
            System.IO.File.Delete(filePath);
        }
    }

    private string GetPhysicalFilePath(FileContent fileContent)
    {
        if (Uri.TryCreate(fileContent.Url, UriKind.Absolute, out var uri))
        {
            var relativePath = uri.LocalPath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
            return Path.Combine(_webHostEnvironment.WebRootPath, relativePath);
        }

        return Path.Combine(_webHostEnvironment.WebRootPath, "files", fileContent.Name);
    }
}
