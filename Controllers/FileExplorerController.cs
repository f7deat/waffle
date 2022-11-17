using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Data;
using Waffle.Entities;

namespace Waffle.Controllers
{
    [Route("api/[controller]")]
    public class FileExplorerController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ApplicationDbContext _context;
        public FileExplorerController(IWebHostEnvironment webHostEnvironment, ApplicationDbContext context)
        {
            _webHostEnvironment = webHostEnvironment;
            _context = context;
        }

        [HttpGet("list")]
        public async Task<IActionResult> ListAsync()
        {
            return Ok(new
            {
                data = await _context.FileContents.OrderByDescending(x => x.Id).ToListAsync(),
                total = await _context.FileContents.CountAsync()
            });
        }

        [HttpPost("delete-file-content/{id}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
        {
            if (await _context.FileItems.AnyAsync(x => x.FileId == id))
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "File in usage!"
                }));
            }
            var fileContent = await _context.FileContents.FindAsync(id);
            if (fileContent is null)
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "File not found!"
                }));
            }
            var path = Path.Combine(_webHostEnvironment.WebRootPath, fileContent.Url);
            if (System.IO.File.Exists(path))
            {
                System.IO.File.Delete(path);
            }
            _context.FileContents.Remove(fileContent);
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

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

            return Ok(await _context.FileContents.AddAsync(new FileContent
            {
                Name = file.FileName,
                Size = file.Length,
                Type = file.ContentType,
                Url = $"/files/{file.FileName}"
            }));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await _context.FileContents.FindAsync(id));

        [HttpGet("file-items/{id}")]
        public async Task<IActionResult> GetFileItemsAsync([FromRoute] Guid id)
        {
            var fileContent = from a in _context.FileItems
                              join b in _context.WorkContents on a.ItemId equals b.Id
                              where a.FileId == id
                              select b;
            return Ok(new
            {
                data = await fileContent.ToListAsync(),
                total = await fileContent.CountAsync()
            });
        }
    }
}
