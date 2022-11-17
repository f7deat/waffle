using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Waffle.Data;
using Waffle.Entities;

namespace Waffle.Controllers
{
    [Route("api/[controller]")]
    public class StyleController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        public StyleController(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet("")]
        public async Task<IActionResult> GetAsync()
        {
            var path = GetPath();
            CreateFile(path);
            return Ok(await System.IO.File.ReadAllTextAsync(GetPath()));
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveAsync([FromBody] WorkContent workItem)
        {
            var path = GetPath();
            CreateFile(path);
            await System.IO.File.WriteAllTextAsync(path, workItem.Arguments);

            return Ok(IdentityResult.Success);
        }

        private static void CreateFile(string path)
        {
            if (!System.IO.File.Exists(path))
            {
                var file = System.IO.File.Create(path);
                file.Close();
            }
        }

        private string GetPath() => Path.Combine(_webHostEnvironment.WebRootPath, "css", "custom.css");
    }
}
