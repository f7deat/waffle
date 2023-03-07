using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Runtime.InteropServices;
using Waffle.Data;
using Waffle.Entities;

namespace Waffle.Controllers
{
    [Route("api/[controller]")]
    public class StyleController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IConfiguration _configuration;
        public StyleController(IWebHostEnvironment webHostEnvironment, IConfiguration configuration)
        {
            _webHostEnvironment = webHostEnvironment;
            _configuration = configuration;
        }

        [HttpGet("")]
        public async Task<IActionResult> GetAsync()
        {
            var path = GetPath();
            CreateFile(path);
            return Ok(await System.IO.File.ReadAllTextAsync(GetPath()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync([FromRoute] Guid id)
        {
            var path = Path.Combine(_webHostEnvironment.WebRootPath, "css", $"{id}.css");
            if (!System.IO.File.Exists(path))
            {
                var file = System.IO.File.Create(path);
                file.Close();
            }
            return Ok(await System.IO.File.ReadAllTextAsync(path));
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveAsync([FromBody] WorkContent workItem)
        {
            CreateFile(GetPath());
            await System.IO.File.WriteAllTextAsync(GetPath(), workItem.Arguments);
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

        private string GetPath() => Path.Combine(_webHostEnvironment.WebRootPath, "css", $"{_configuration.GetValue<string>("theme").ToLower()}.css");
    }
}
