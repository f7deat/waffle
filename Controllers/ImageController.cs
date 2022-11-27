using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models.Components;

namespace Waffle.Controllers
{
    [Route("api/[controller]")]
    public class ImageController : Controller
    {
        private readonly ILogger<ImageController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ImageController(ILogger<ImageController> logger, ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _logger = logger;
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpPost("upload/{id}")]
        public async Task<IActionResult> UploadAsync([FromRoute] Guid id, [FromForm] IFormFile file)
        {
            if (file is null)
            {
                return BadRequest();
            }
            var workContent = await _context.WorkContents.FindAsync(id);
            if (workContent is null)
            {
                return Ok(IdentityResult.Failed());
            }

            var filePath = Path.Combine(_webHostEnvironment.WebRootPath, "imgs", file.FileName);
            using (var stream = System.IO.File.Create(filePath))
            {
                await file.CopyToAsync(stream);
            }

            var fileContent = new FileContent
            {
                Name = file.FileName,
                Size = file.Length,
                Type = file.ContentType,
                Url = $"/imgs/{file.FileName}"
            };

            await _context.FileContents.AddAsync(fileContent);
            await _context.SaveChangesAsync();

            await _context.FileItems.AddAsync(new FileItem
            {
                FileId = fileContent.Id,
                ItemId = id
            });

            var image = new Image
            {
                Src = fileContent.Url,
                Alt = fileContent.Name,
                Id = fileContent.Id
            };

            workContent.Arguments = JsonSerializer.Serialize(image);

            await _context.SaveChangesAsync();

            return Ok(IdentityResult.Success);
        }

        [HttpPost("editor-block/{id}")]
        public async Task<IActionResult> UploadEditorBlockAsync([FromRoute] Guid id, [FromForm] IFormFile image)
        {
            if (image is null)
            {
                return BadRequest();
            }
            var workContent = await _context.WorkContents.FindAsync(id);
            if (workContent is null)
            {
                return Ok(IdentityResult.Failed());
            }

            var filePath = Path.Combine(_webHostEnvironment.WebRootPath, "imgs", image.FileName);
            using (var stream = System.IO.File.Create(filePath))
            {
                await image.CopyToAsync(stream);
            }

            var fileContent = new FileContent
            {
                Name = image.FileName,
                Size = image.Length,
                Type = image.ContentType,
                Url = $"/imgs/{image.FileName}"
            };

            await _context.FileContents.AddAsync(fileContent);
            await _context.SaveChangesAsync();

            await _context.FileItems.AddAsync(new FileItem
            {
                FileId = fileContent.Id,
                ItemId = id
            });

            await _context.SaveChangesAsync();

            return Ok(new {
                success = 1,
                file = new {
                    url = $"https://{Request.Host.Value}/{fileContent.Url}"
                }
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync([FromRoute] Guid id)
        {
            var workContent = await _context.WorkContents.FindAsync(id);
            if (workContent is null || string.IsNullOrEmpty(workContent.Arguments))
            {
                return Ok(workContent);
            }
            var image = JsonSerializer.Deserialize<Image>(workContent.Arguments);
            return Ok(image);
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveAsync([FromBody] Image model)
        {
            if (model is null)
            {
                return Ok(IdentityResult.Failed());
            }

            var workContent = await _context.WorkContents.FindAsync(model.Id);
            if (workContent is null)
            {
                return Ok(IdentityResult.Failed());
            }

            var image = JsonSerializer.Deserialize<Image>(workContent.Arguments);

            if (image is null)
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "No value has been found!"
                }));
            }

            image.Width = model.Width;
            image.Height = model.Height;
            image.Alt = model.Alt;
            image.Url = model.Url;
            image.ClassName = model.ClassName;

            workContent.Arguments = JsonSerializer.Serialize(image);
            await _context.SaveChangesAsync();

            return Ok(IdentityResult.Success);
        }
    }
}
