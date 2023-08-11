﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO.Compression;
using System.Text.Json;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.ExternalAPI.GoogleAggregate;
using Waffle.ExternalAPI.Models;
using Waffle.ExternalAPI.Models.GoogleAggregate;
using Waffle.Models;
using Waffle.Models.Components;
using Waffle.Models.Components.Lister;
using Waffle.Models.Components.Specifications;
using Waffle.Models.Settings;

namespace Waffle.Controllers;

public class BackupController : BaseController
{
    private readonly ApplicationDbContext _context;
    private readonly IComponentService _componentService;
    private readonly IAppSettingService _appSettingService;
    private readonly ICatalogService _catalogService;
    private readonly IWorkService _workService;
    private readonly IWebHostEnvironment _webHostEnvironment;
    public BackupController(IWebHostEnvironment webHostEnvironment, ApplicationDbContext context, IComponentService componentService, IAppSettingService appSettingService, ICatalogService catalogService, IWorkService workService)
    {
        _context = context;
        _componentService = componentService;
        _appSettingService = appSettingService;
        _catalogService = catalogService;
        _workService = workService;
        _webHostEnvironment = webHostEnvironment;
    }

    [HttpGet("export")]
    public async Task<IActionResult> ExportAsync()
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
        };
        var path = Path.Combine(_webHostEnvironment.WebRootPath, "backup");
        if (!Directory.Exists(path)) Directory.CreateDirectory(path);
        var directoryInfo = new DirectoryInfo(path);
        var files = directoryInfo.GetFiles();
        foreach (var file in files)
        {
            file.Delete();
        }
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

    [HttpPost("export/catalog/{id}")]
    public async Task<IActionResult> ExportCatalogAsync([FromRoute] Guid id) => Ok(new
    {
        catalog = await _catalogService.FindAsync(id),
        items = await _workService.ExportByCatalogAsync(id)
    });

    [HttpPost("import")]
    public async Task<IActionResult> ImportAsync([FromForm] IFormFile file)
    {
        if (file is null)
        {
            return Ok(IdentityResult.Failed(new IdentityError
            {
                Description = "File not found!"
            }));
        }
        var stream = file.OpenReadStream();
        var data = await JsonSerializer.DeserializeAsync<BackupListItem>(stream);
        if (data is null)
        {
            return Ok(IdentityResult.Failed(new IdentityError
            {
                Description = "Import failed!"
            }));
        }
        if (data.WorkContents.Any())
        {
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.WorkContents");
            await _context.WorkContents.AddRangeAsync(data.WorkContents);
        }
        if (data.WorkItems.Any())
        {
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.WorkItems");
            await _context.WorkItems.AddRangeAsync(data.WorkItems);
        }
        if (data.FileContents.Any())
        {
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.FileContents");
            await _context.FileContents.AddRangeAsync(data.FileContents);
        }
        if (data.Catalogs.Any())
        {
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.Catalogs");
            await _context.Catalogs.AddRangeAsync(data.Catalogs);
        }
        if (data.AppSettings.Any())
        {
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.AppSettings");
            await _context.AppSettings.AddRangeAsync(data.AppSettings);
        }
        if (data.Components.Any())
        {
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.Components");
            await _context.Components.AddRangeAsync(data.Components);
        }
        if (data.Localizations.Any())
        {
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.Localizations");
            await _context.Localizations.AddRangeAsync(data.Localizations);
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

    [HttpPost("upgrade")]
    public async Task<IActionResult> UpgradeAsync()
    {
        await EnsureComponentsAsync();
        await _context.SaveChangesAsync();
        await _appSettingService.EnsureSettingAsync(nameof(Facebook));
        await _appSettingService.EnsureSettingAsync(nameof(Google));
        await _appSettingService.EnsureSettingAsync(nameof(SendGrid));
        await _appSettingService.EnsureSettingAsync(nameof(Telegram));
        await _appSettingService.EnsureSettingAsync(nameof(Social));
        await _appSettingService.EnsureSettingAsync(nameof(Sidebar));
        return Ok(IdentityResult.Success);
    }

    [HttpPost("upgrade/components")]
    public async Task<IActionResult> UpgradeComponentAsync()
    {
        await EnsureComponentsAsync();
        return Ok(IdentityResult.Success);
    }

    private async Task EnsureComponentsAsync()
    {
        await _componentService.EnsureComponentAsync(nameof(ArticlePicker));
        await _componentService.EnsureComponentAsync(nameof(ArticleSpotlight));
        await _componentService.EnsureComponentAsync("Block");
        await _componentService.EnsureComponentAsync(nameof(BlockEditor));
        await _componentService.EnsureComponentAsync(nameof(Card));
        await _componentService.EnsureComponentAsync(nameof(ContactForm));
        await _componentService.EnsureComponentAsync(nameof(Document));
        await _componentService.EnsureComponentAsync(nameof(GoogleMap));
        await _componentService.EnsureComponentAsync(nameof(Image));
        await _componentService.EnsureComponentAsync(nameof(Swiper));
        await _componentService.EnsureComponentAsync(nameof(Masonry));
        await _componentService.EnsureComponentAsync(nameof(Link));
        await _componentService.EnsureComponentAsync(nameof(ListGroup));
        await _componentService.EnsureComponentAsync(nameof(Lookbook));
        await _componentService.EnsureComponentAsync(nameof(Tag));
        await _componentService.EnsureComponentAsync(nameof(Feed));
        await _componentService.EnsureComponentAsync(nameof(Row));
        await _componentService.EnsureComponentAsync(nameof(Column));
        await _componentService.EnsureComponentAsync(nameof(Image));
        await _componentService.EnsureComponentAsync(nameof(Trend));
        await _componentService.EnsureComponentAsync(nameof(Navbar));
        await _componentService.EnsureComponentAsync(nameof(Jumbotron));
        await _componentService.EnsureComponentAsync(nameof(PostContent));
        await _componentService.EnsureComponentAsync(nameof(VideoPlayer));
        await _componentService.EnsureComponentAsync(nameof(VideoPlayList));
    }
}
