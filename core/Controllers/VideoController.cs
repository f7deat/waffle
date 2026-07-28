using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Services.Videos.Args;
using Waffle.Core.Services.Videos.Filters;
using Waffle.Data;
using Waffle.Entities.Files;
using Waffle.Extensions;

namespace Waffle.Controllers;

public class VideoController(IWebHostEnvironment webHostEnvironment, ApplicationDbContext context) : BaseController
{
    private readonly IWebHostEnvironment _webHostEnvironment = webHostEnvironment;
    private readonly ApplicationDbContext _context = context;
    private const long MaxVideoSize = 200 * 1024 * 1024;
    private static readonly string[] SupportedVideoExtensions = [".mp4", ".webm", ".mov", ".m4v", ".avi", ".mkv"];

    [HttpGet("list")]
    public async Task<IActionResult> ListAsync([FromQuery] VideoFilterOptions filterOptions)
    {
        var query = _context.Videos.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(filterOptions.Keyword))
        {
            var keyword = filterOptions.Keyword.Trim();
            query = query.Where(x =>
                EF.Functions.Like(x.Name, $"%{keyword}%") ||
                (x.Description != null && EF.Functions.Like(x.Description, $"%{keyword}%")) ||
                (x.Provider != null && EF.Functions.Like(x.Provider, $"%{keyword}%"))
            );
        }

        if (filterOptions.SourceType.HasValue)
        {
            query = query.Where(x => x.SourceType == filterOptions.SourceType.Value);
        }

        var total = await query.CountAsync();
        var data = await query
            .OrderByDescending(x => x.CreatedDate)
            .Skip((filterOptions.Current - 1) * filterOptions.PageSize)
            .Take(filterOptions.PageSize)
            .ToListAsync();

        return Ok(new
        {
            data,
            total,
            filterOptions.Current,
            filterOptions.PageSize
        });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAsync([FromRoute] Guid id)
    {
        var video = await _context.Videos.FindAsync(id);
        if (video is null) return BadRequest("Video not found!");
        return Ok(video);
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadAsync([FromForm] UploadVideoArgs args)
    {
        try
        {
            if (args.File is null) return BadRequest("Video file is required!");
            if (!IsVideoFile(args.File.ContentType, args.File.FileName)) return BadRequest("Unsupported video format!");
            if (args.File.Length > MaxVideoSize) return BadRequest("Video exceeds the limit of 200 MB.");

            var extension = Path.GetExtension(args.File.FileName);
            var folder = DateTime.UtcNow.ToString("yyyyMM");
            var saveName = $"{Guid.NewGuid():N}{extension}";
            var uploadPath = Path.Combine(_webHostEnvironment.WebRootPath, "videos", folder);
            if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);

            var filePath = Path.Combine(uploadPath, saveName);
            await using (var stream = System.IO.File.Create(filePath))
            {
                await args.File.CopyToAsync(stream);
            }

            var url = $"{Request.Scheme}://{Request.Host.Value}/videos/{folder}/{saveName}";
            var now = DateTime.UtcNow;
            var video = new Video
            {
                Name = string.IsNullOrWhiteSpace(args.Name) ? args.File.FileName : args.Name.Trim(),
                Description = args.Description,
                Url = url,
                ThumbnailUrl = args.ThumbnailUrl,
                SourceType = VideoSourceType.Upload,
                Provider = "local",
                MimeType = args.File.ContentType,
                Size = args.File.Length,
                DurationSeconds = args.DurationSeconds,
                CreatedBy = User.GetId(),
                CreatedDate = now,
                ModifiedBy = User.GetId(),
                ModifiedDate = now
            };

            await _context.Videos.AddAsync(video);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                succeeded = true,
                data = video
            });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.ToString());
        }
    }

    [HttpPost("external")]
    public async Task<IActionResult> CreateExternalAsync([FromBody] CreateExternalVideoArgs args)
    {
        if (string.IsNullOrWhiteSpace(args.Url)) return BadRequest("Video url is required!");
        if (!TryNormalizeExternalUrl(args.Url, out var normalizedUrl)) return BadRequest("Video url is invalid!");

        var now = DateTime.UtcNow;
        var userId = User.GetId();
        var video = new Video
        {
            Name = string.IsNullOrWhiteSpace(args.Name) ? normalizedUrl : args.Name.Trim(),
            Description = args.Description,
            Url = normalizedUrl,
            ThumbnailUrl = args.ThumbnailUrl,
            SourceType = VideoSourceType.External,
            Provider = DetectProvider(normalizedUrl),
            DurationSeconds = args.DurationSeconds,
            CreatedBy = userId,
            CreatedDate = now,
            ModifiedBy = userId,
            ModifiedDate = now
        };

        await _context.Videos.AddAsync(video);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            succeeded = true,
            data = video
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAsync([FromRoute] Guid id, [FromBody] UpdateVideoArgs args)
    {
        var video = await _context.Videos.FindAsync(id);
        if (video is null) return BadRequest("Video not found!");

        if (!string.IsNullOrWhiteSpace(args.Name)) video.Name = args.Name.Trim();
        if (args.Description != null) video.Description = args.Description;
        if (args.ThumbnailUrl != null) video.ThumbnailUrl = args.ThumbnailUrl;
        if (args.DurationSeconds.HasValue) video.DurationSeconds = args.DurationSeconds;

        if (!string.IsNullOrWhiteSpace(args.Url) && video.SourceType == VideoSourceType.External)
        {
            if (!TryNormalizeExternalUrl(args.Url, out var normalizedUrl)) return BadRequest("Video url is invalid!");
            video.Url = normalizedUrl;
            video.Provider = DetectProvider(normalizedUrl);
        }

        video.ModifiedBy = User.GetId();
        video.ModifiedDate = DateTime.UtcNow;

        _context.Videos.Update(video);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            succeeded = true,
            data = video
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
    {
        var video = await _context.Videos.FindAsync(id);
        if (video is null) return BadRequest("Video not found!");

        if (video.SourceType == VideoSourceType.Upload)
        {
            DeletePhysicalFile(video.Url);
        }

        _context.Videos.Remove(video);
        await _context.SaveChangesAsync();

        return Ok(IdentityResult.Success);
    }

    private static bool IsVideoFile(string? contentType, string fileName)
    {
        if (!string.IsNullOrWhiteSpace(contentType) && contentType.StartsWith("video/", StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }

        var extension = Path.GetExtension(fileName);
        return SupportedVideoExtensions.Contains(extension, StringComparer.OrdinalIgnoreCase);
    }

    private static bool TryNormalizeExternalUrl(string url, out string normalizedUrl)
    {
        normalizedUrl = string.Empty;
        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri)) return false;
        if (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps) return false;
        normalizedUrl = uri.ToString();
        return true;
    }

    private static string DetectProvider(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri)) return "external";
        var host = uri.Host.ToLowerInvariant();

        if (host.Contains("youtube.com") || host.Contains("youtu.be")) return "youtube";
        if (host.Contains("vimeo.com")) return "vimeo";
        if (host.Contains("dailymotion.com")) return "dailymotion";
        return host;
    }

    private void DeletePhysicalFile(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri)) return;

        var relativePath = uri.LocalPath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
        var filePath = Path.Combine(_webHostEnvironment.WebRootPath, relativePath);
        if (System.IO.File.Exists(filePath))
        {
            System.IO.File.Delete(filePath);
        }
    }
}
