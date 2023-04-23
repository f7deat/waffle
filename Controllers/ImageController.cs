using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Models.Components;

namespace Waffle.Controllers
{
    [Route("api/[controller]")]
    public class ImageController : Controller
    {
        private readonly IWorkService _workService;

        public ImageController(IWorkService workService)
        {
            _workService = workService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await _workService.GetAsync<Image>(id));

        [HttpPost("save")]
        public async Task<IActionResult> SaveAsync([FromBody] Image args) => Ok(await _workService.SaveArgumentsAsync(args.Id, args));
    }
}
