using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class LocalizationController : Controller
    {
        private readonly ILocalizationService _localizationService;
        public LocalizationController(ILocalizationService localizationService)
        {
            _localizationService = localizationService;
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetListAsync([FromQuery] LocalizationFilterOptions filterOptions) => Ok(await _localizationService.GetListAsync(filterOptions));

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await _localizationService.GetAsync(id));

        [HttpPost("save")]
        public async Task<IActionResult> SaveAsync([FromBody] Localization args) => Ok(await _localizationService.SaveAsync(args));

        [HttpPost("add")]
        public async Task<IActionResult> AddAsync([FromBody] Localization args) => Ok(await _localizationService.AddAsync(args));

        [HttpPost("delete/{id}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] Guid id) => Ok(await _localizationService.DeleteAsync(id));
    }
}
