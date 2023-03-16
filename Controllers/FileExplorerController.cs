using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class FileExplorerController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ApplicationDbContext _context;
        private readonly IFileExplorerService _fileExplorerService;
        public FileExplorerController(IWebHostEnvironment webHostEnvironment, ApplicationDbContext context, IFileExplorerService fileExplorerService)
        {
            _webHostEnvironment = webHostEnvironment;
            _context = context;
            _fileExplorerService = fileExplorerService;
        }

        [HttpGet("list")]
        public async Task<IActionResult> ListAsync([FromQuery] FileFilterOptions filterOptions) => Ok(await _fileExplorerService.ListAsync(filterOptions));

        [HttpPost("delete-file-content/{id}")]
        public async Task<IActionResult> DeleteFileContentAsync([FromRoute] Guid id)
        {
            var fileContent = await _context.FileContents.FindAsync(id);
            if (fileContent is null)
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "File not found!"
                }));
            }
            var path = Path.Combine(_webHostEnvironment.WebRootPath, "files", fileContent.Name);
            if (System.IO.File.Exists(path))
            {
                System.IO.File.Delete(path);
            }
            _context.FileContents.Remove(fileContent);
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        [HttpPost("delete-file-item")]
        public async Task<IActionResult> DeleteFileItemAsync([FromBody] FileItem fileItem) => Ok(await _fileExplorerService.DeleteFileItemAsync(fileItem));

        [HttpPost("upload")]
        public async Task<IActionResult> UploadAsync([FromForm] IFormFile file)
        {
            if (file is null)
            {
                return BadRequest();
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
                Url = $"https://{Request.Host.Value}/files/{file.FileName}"
            });
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await _context.FileContents.FindAsync(id));

        [HttpGet("file-items/{id}")]
        public async Task<IActionResult> GetFileItemsAsync([FromRoute] Guid id)
        {
            var fileContent = from a in _context.FileItems
                              join b in _context.WorkContents on a.ItemId equals b.Id
                              join c in _context.Components on b.ComponentId equals c.Id
                              where a.FileId == id
                              select new WorkListItem
                              {
                                  Id = a.ItemId,
                                  Name = b.Name,
                                  NormalizedName = c.NormalizedName,
                              };
            return Ok(new
            {
                data = await fileContent.ToListAsync(),
                total = await fileContent.CountAsync()
            });
        }

        [HttpPost("upload-from-url")]
        public async Task<IActionResult> UploadFromUrlAsync([FromBody] FileContent file) => Ok(await _fileExplorerService.UploadFromUrlAsync(file.Url));
    }
}
