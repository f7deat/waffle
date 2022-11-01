using Microsoft.AspNetCore.Mvc;
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
    }
}
