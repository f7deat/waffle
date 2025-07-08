using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Text.Json;
using Waffle.Core.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Options;
using Waffle.Core.Services.Files.Models;
using Waffle.Data;
using Waffle.Entities;
using Waffle.ExternalAPI.Models;
using Waffle.Models;
using Waffle.Models.Result;

namespace Waffle.Core.Services;

public class FileExplorerService(ApplicationDbContext context, IFileRepository _fileRepository, IOptions<SettingOptions> options, IHCAService _hcaService) : IFileService
{
    private readonly ApplicationDbContext _context = context;
    private readonly SettingOptions _options = options.Value;

    public async Task<int> CountAsync() => await _fileRepository.CountAsync();

    public Task<FileContent?> FindAsync(Guid id) => _fileRepository.FindAsync(id);

    public Task<decimal> GetTotalSizeAsync() => _fileRepository.GetTotalSizeAsync();

    public Task<ListResult<FileAndFolderListItem>> ListAsync(FileFilterOptions filterOptions) => _fileRepository.ListAsync(filterOptions);

    public async Task<IdentityResult> UploadFromUrlAsync(string url)
    {
        var uri = new Uri(url);
        await _context.FileContents.AddAsync(new FileContent
        {
            Name = Path.GetFileName(uri.LocalPath),
            Url = url,
            Size = 0,
            Type = Path.GetExtension(uri.LocalPath).ToLower()
        });
        await _context.SaveChangesAsync();
        return IdentityResult.Success;
    }

    public async Task<DefResult> UploadToHPUNIAsync(IFormFile file)
    {
        var url = $"https://file.dhhp.edu.vn/api/file/upload?apiKey={_options.UploadAPIKey}";
        using var client = new HttpClient();
        var response = await client.PostAsync(url, new MultipartFormDataContent
            {
                { new StreamContent(file.OpenReadStream()), "file", file.FileName },
                { new StringContent("common"), "SiteCode" }
            });
        if (!response.IsSuccessStatusCode) return DefResult.Failed("Upload faidled!");
        var fileContent = await JsonSerializer.DeserializeAsync<FileUploadResponse>(await response.Content.ReadAsStreamAsync());
        if (fileContent is null) return DefResult.Failed("Upload dserialize failed!");
        await _context.FileContents.AddAsync(new FileContent
        {
            Id = fileContent.Id,
            Name = file.FileName,
            Size = file.Length,
            Url = fileContent.Url,
            Type = file.ContentType,
            UploadDate = DateTime.Now,
            UploadBy = _hcaService.GetUserId()
        });
        await _context.SaveChangesAsync();
        return DefResult.Ok(new
        {
            fileContent.Url
        });
    }
}
