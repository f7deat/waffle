using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Services.Files.Args;
using Waffle.Data;
using Waffle.Entities.Files;
using Waffle.Models;

namespace Waffle.Controllers;

public class ImageLibraryController(IWebHostEnvironment webHostEnvironment, ApplicationDbContext context, ILookupNormalizer lookupNormalizer) : BaseController
{
    private readonly IWebHostEnvironment _webHostEnvironment = webHostEnvironment;
    private readonly ApplicationDbContext _context = context;
    private readonly ILookupNormalizer _lookupNormalizer = lookupNormalizer;
    private const long MaxImageSize = 10 * 1024 * 1024;
    private static readonly string[] SupportedImageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg"];

    [HttpGet("albums")]
    public async Task<IActionResult> ListAlbumsAsync([FromQuery] FilterOptions filterOptions, [FromQuery] string? keyword)
    {
        var query = _context.ImageAlbums.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(keyword))
        {
            query = query.Where(x => EF.Functions.Like(x.Name, $"%{keyword}%") || (x.Description != null && EF.Functions.Like(x.Description, $"%{keyword}%")));
        }

        var total = await query.CountAsync();
        var data = await query.OrderByDescending(x => x.Name)
            .Skip((filterOptions.Current - 1) * filterOptions.PageSize)
            .Take(filterOptions.PageSize)
            .Select(x => new
            {
                x.Id,
                x.Name,
                x.Description,
                x.NormalizedName,
                imageCount = _context.ImageLibraryItems.Count(i => i.AlbumId == x.Id)
            })
            .ToListAsync();

        return Ok(new
        {
            data,
            total,
            filterOptions.Current,
            filterOptions.PageSize
        });
    }

    [HttpPost("album")]
    public async Task<IActionResult> AddAlbumAsync([FromBody] UpsertImageAlbumArgs args)
    {
        if (string.IsNullOrWhiteSpace(args.Name)) return BadRequest("Album name is required!");

        var normalizedName = NormalizeName(args.Name);
        if (await _context.ImageAlbums.AnyAsync(x => x.NormalizedName == normalizedName))
        {
            return BadRequest("Album already exists!");
        }

        var album = new ImageAlbum
        {
            Name = args.Name,
            Description = args.Description,
            NormalizedName = normalizedName
        };

        await _context.ImageAlbums.AddAsync(album);
        await _context.SaveChangesAsync();
        return Ok(new
        {
            succeeded = true,
            data = album
        });
    }

    [HttpPut("album/{id}")]
    public async Task<IActionResult> UpdateAlbumAsync([FromRoute] Guid id, [FromBody] UpsertImageAlbumArgs args)
    {
        if (string.IsNullOrWhiteSpace(args.Name)) return BadRequest("Album name is required!");

        var album = await _context.ImageAlbums.FindAsync(id);
        if (album is null) return BadRequest("Album not found!");

        var normalizedName = NormalizeName(args.Name);
        if (await _context.ImageAlbums.AnyAsync(x => x.Id != id && x.NormalizedName == normalizedName))
        {
            return BadRequest("Album already exists!");
        }

        album.Name = args.Name;
        album.Description = args.Description;
        album.NormalizedName = normalizedName;

        _context.ImageAlbums.Update(album);
        await _context.SaveChangesAsync();
        return Ok(new
        {
            succeeded = true,
            data = album
        });
    }

    [HttpDelete("album/{id}")]
    public async Task<IActionResult> DeleteAlbumAsync([FromRoute] Guid id)
    {
        var album = await _context.ImageAlbums.FindAsync(id);
        if (album is null) return BadRequest("Album not found!");

        var images = await _context.ImageLibraryItems.Where(x => x.AlbumId == id).ToListAsync();
        foreach (var image in images)
        {
            DeletePhysicalFile(image.Url);
        }

        _context.ImageAlbums.Remove(album);
        await _context.SaveChangesAsync();

        var albumFolder = Path.Combine(_webHostEnvironment.WebRootPath, "albums", id.ToString());
        if (Directory.Exists(albumFolder))
        {
            Directory.Delete(albumFolder, true);
        }

        return Ok(IdentityResult.Success);
    }

    [HttpGet("album/{albumId}/images")]
    public async Task<IActionResult> ListImagesAsync([FromRoute] Guid albumId, [FromQuery] FilterOptions filterOptions)
    {
        if (!await _context.ImageAlbums.AnyAsync(x => x.Id == albumId)) return BadRequest("Album not found!");

        var query = _context.ImageLibraryItems.AsNoTracking().Where(x => x.AlbumId == albumId);
        var total = await query.CountAsync();
        var data = await query.OrderByDescending(x => x.UploadedAt)
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

    [HttpPost("album/{albumId}/images")]
    public async Task<IActionResult> UploadImagesAsync([FromRoute] Guid albumId, [FromForm] UploadAlbumImagesArgs args)
    {
        var album = await _context.ImageAlbums.FindAsync(albumId);
        if (album is null) return BadRequest("Album not found!");
        if (args.Files is null || args.Files.Count == 0) return BadRequest("Images not found!");

        var albumFolder = Path.Combine(_webHostEnvironment.WebRootPath, "albums", album.Id.ToString());
        if (!Directory.Exists(albumFolder)) Directory.CreateDirectory(albumFolder);

        var urlPrefix = $"{Request.Scheme}://{Request.Host.Value}/albums/{album.Id}/";
        var images = new List<ImageLibraryItem>();

        foreach (var file in args.Files)
        {
            if (!IsImageType(file.ContentType, file.FileName)) return BadRequest($"{file.FileName} is not a valid image!");
            if (file.Length > MaxImageSize) return BadRequest($"{file.FileName} exceeds the limit of 10 MB.");

            var extension = Path.GetExtension(file.FileName);
            var saveName = $"{Guid.NewGuid():N}{extension}";
            var filePath = Path.Combine(albumFolder, saveName);

            using (var stream = System.IO.File.Create(filePath))
            {
                await file.CopyToAsync(stream);
            }

            images.Add(new ImageLibraryItem
            {
                AlbumId = album.Id,
                Name = file.FileName,
                Url = urlPrefix + saveName,
                Type = file.ContentType,
                UploadedAt = DateTime.UtcNow
            });
        }

        await _context.ImageLibraryItems.AddRangeAsync(images);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            succeeded = true,
            data = images
        });
    }

    [HttpDelete("image/{id}")]
    public async Task<IActionResult> DeleteImageAsync([FromRoute] Guid id)
    {
        var image = await _context.ImageLibraryItems.FindAsync(id);
        if (image is null) return BadRequest("Image not found!");

        DeletePhysicalFile(image.Url);

        _context.ImageLibraryItems.Remove(image);
        await _context.SaveChangesAsync();

        return Ok(IdentityResult.Success);
    }

    private string NormalizeName(string input)
        => _lookupNormalizer.NormalizeName(input).ToLower().Replace(" ", "-");

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