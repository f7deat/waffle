using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Foundations;
using Waffle.Models.Filters.Catalogs.Collections;

namespace Waffle.Controllers;

public class CollectionController(ICollectionService _collectionService) : BaseController
{
    [HttpGet("list")]
    public async Task<IActionResult> GetListAsync([FromQuery] CollectionFilterOptions filterOptions) => Ok(await _collectionService.ListAsync(filterOptions));

    [HttpPost("add")]
    public async Task<IActionResult> AddAsync([FromQuery] Collection args) => Ok(await _collectionService.AddAsync(args));

    [HttpPost("delete")]
    public async Task<IActionResult> DeleteAsync([FromBody] Collection args) => Ok(await _collectionService.DeleteAsync(args));
}
