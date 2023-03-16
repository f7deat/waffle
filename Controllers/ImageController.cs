using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Waffle.Core.Interfaces.IService;
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
        private readonly IWorkService _workService;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ImageController(ILogger<ImageController> logger, ApplicationDbContext context, IWebHostEnvironment webHostEnvironment, IWorkService workService)
        {
            _logger = logger;
            _context = context;
            _webHostEnvironment = webHostEnvironment;
            _workService = workService;
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

            return Ok(new
            {
                success = 1,
                file = new
                {
                    url = $"https://{Request.Host.Value}/{fileContent.Url}"
                }
            });
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddAsync([FromBody] FileItem model)
        {
            var file = await _context.FileContents.FindAsync(model.FileId);
            if (file is null)
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "File not found!"
                }));
            }
            var image = await _context.WorkContents.FindAsync(model.ItemId);
            if (image is null)
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "Work content not found!"
                }));
            }
            await _context.FileItems.AddAsync(new FileItem { FileId = file.Id, ItemId = image.Id });
            await _context.SaveChangesAsync();

            return Ok(new
            {
                succeeded = true,
                data = file
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await _workService.GetAsync<Image>(id));

        [HttpPost("save")]
        public async Task<IActionResult> SaveAsync([FromBody] Image model)
        {
            var workContent = await _context.WorkContents.FindAsync(model.Id);
            if (workContent is null)
            {
                return Ok(IdentityResult.Failed());
            }

            var image = new Image();

            if (!string.IsNullOrEmpty(workContent.Arguments))
            {
                image = JsonSerializer.Deserialize<Image>(workContent.Arguments);
                image ??= new Image();
            }
            image.Alt = model.Alt;
            image.Description = model.Description;
            image.Width = model.Width;
            image.Height = model.Height;
            image.ClassName = model.ClassName;

            workContent.Arguments = JsonSerializer.Serialize(image);
            await _context.SaveChangesAsync();

            return Ok(IdentityResult.Success);
        }
    }
}
