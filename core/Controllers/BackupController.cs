﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO.Compression;
using System.Text.Json;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Models;
using Waffle.Models.Args;

namespace Waffle.Controllers;

public class BackupController(IWebHostEnvironment _webHostEnvironment, ApplicationDbContext _context, ICatalogService _catalogService, IWorkService _workService, ILogService _logService) : BaseController
{
    [HttpGet("export")]
    public async Task<IActionResult> ExportAsync()
    {
        try
        {
            var json = new BackupListItem
            {
                WorkContents = await _context.WorkContents.ToListAsync(),
                WorkItems = await _context.WorkItems.ToListAsync(),
                FileContents = await _context.FileContents.ToListAsync(),
                AppSettings = await _context.AppSettings.ToListAsync(),
                Components = await _context.Components.ToListAsync(),
                Catalogs = await _context.Catalogs.ToListAsync(),
                Localizations = await _context.Localizations.ToListAsync(),
                Users = await _context.Users.ToListAsync(),
                Roles = await _context.Roles.ToListAsync(),
                UserRoles = await _context.UserRoles.ToListAsync(),
                Comments = await _context.Comments.ToListAsync(),
                Products = await _context.Products.ToListAsync(),
                Orders = await _context.Orders.ToListAsync(),
                OrderDetails = await _context.OrderDetails.ToListAsync()
            };
            var path = Path.Combine(_webHostEnvironment.WebRootPath, "backup");
            if (!Directory.Exists(path)) Directory.CreateDirectory(path);
            var directoryInfo = new DirectoryInfo(path);
            var files = directoryInfo.GetFiles();
            foreach (var file in files) file.Delete();
            var fileName = Path.Combine(path, $"{Request.Host.Host}-{DateTime.Now:ddMMyyyy}.json");
            using (var outputFile = new StreamWriter(fileName))
            {
                await outputFile.WriteAsync(JsonSerializer.Serialize(json));
            }
            if (System.IO.File.Exists(Path.Combine(_webHostEnvironment.WebRootPath, "files", $"{Request.Host.Host}-{DateTime.Now:ddMMyyyy}.zip")))
            {
                return Redirect($"/files/{Request.Host.Host}-{DateTime.Now:ddMMyyyy}.zip");
            }

            ZipFile.CreateFromDirectory(path, Path.Combine(_webHostEnvironment.WebRootPath, "files", $"{Request.Host.Host}-{DateTime.Now:ddMMyyyy}.zip"), CompressionLevel.SmallestSize, false);

            return Redirect($"/files/{Request.Host.Host}-{DateTime.Now:ddMMyyyy}.zip");
        }
        catch (Exception ex)
        {
            await _logService.MessageAsync(ex.ToString());
            return BadRequest();
        }
    }

    [HttpPost("export/catalog/{id}")]
    public async Task<IActionResult> ExportCatalogAsync([FromRoute] Guid id) => Ok(new
    {
        catalog = await _catalogService.FindAsync(id),
        items = await _workService.ExportByCatalogAsync(id)
    });

    [HttpPost("import")]
    public async Task<IActionResult> ImportAsync([FromForm] ImportArgs args)
    {
        if (args.File is null) return BadRequest("File not found!");
        var fileStream = args.File.OpenReadStream();
        if (!args.File.FileName.EndsWith(".zip")) return BadRequest("File extension not support!");

        using var archive = new ZipArchive(fileStream);
        foreach (ZipArchiveEntry entry in archive.Entries)
        {
            var stream = entry.Open();
            var data = await JsonSerializer.DeserializeAsync<BackupListItem>(stream);
            if (data is null) return BadRequest("Data incorrect!");

            if (data.WorkContents.Count != 0)
            {
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.WorkContents");
                await _context.WorkContents.AddRangeAsync(data.WorkContents);
            }
            if (data.WorkItems.Count != 0)
            {
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.WorkItems");
                await _context.WorkItems.AddRangeAsync(data.WorkItems);
            }
            if (data.FileContents.Count != 0)
            {
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.FileContents");
                await _context.FileContents.AddRangeAsync(data.FileContents);
            }
            if (data.Catalogs.Count != 0)
            {
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.Catalogs");
                await _context.Catalogs.AddRangeAsync(data.Catalogs);
            }
            if (data.AppSettings.Count != 0)
            {
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.AppSettings");
                await _context.AppSettings.AddRangeAsync(data.AppSettings);
            }
            if (data.Components.Count != 0)
            {
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.Components");
                await _context.Components.AddRangeAsync(data.Components);
            }
            if (data.Localizations.Count != 0)
            {
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.Localizations");
                await _context.Localizations.AddRangeAsync(data.Localizations);
            }
            if (data.Comments.Count != 0)
            {
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.Comments");
                await _context.Comments.AddRangeAsync(data.Comments);
            }
            if (data.Products.Count != 0)
            {
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.Products");
                await _context.Products.AddRangeAsync(data.Products);
            }
            if (data.Orders.Count != 0)
            {
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.Orders");
                await _context.Orders.AddRangeAsync(data.Orders);
            }
            if (data.OrderDetails.Count != 0)
            {
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.OrderDetails");
                await _context.OrderDetails.AddRangeAsync(data.OrderDetails);
            }
        }
        await _context.SaveChangesAsync();
        return Ok(IdentityResult.Success);
    }

    [HttpGet("statistic")]
    public async Task<IActionResult> StatisticAsync() => Ok(new
    {
        catalog = await _context.Catalogs.CountAsync(),
        workContent = await _context.WorkContents.CountAsync(),
        workItem = await _context.WorkItems.CountAsync(),
        component = await _context.Components.CountAsync(),
        fileContent = await _context.FileContents.CountAsync(),
        localization = await _context.Localizations.CountAsync()
    });
}
