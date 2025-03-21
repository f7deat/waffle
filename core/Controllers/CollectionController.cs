﻿using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models.Filters.Catalogs.Collections;

namespace Waffle.Controllers;

public class CollectionController(ICollectionService _collectionService) : BaseController
{
    [HttpGet("list")]
    public async Task<IActionResult> GetListAsync([FromQuery] CollectionFilterOptions filterOptions) => Ok(await _collectionService.ListAsync(filterOptions));

    [HttpPost("add")]
    public async Task<IActionResult> AddAsync([FromBody] Collection args)
    {
        var result = await _collectionService.AddAsync(args);
        if (!result.Succeeded) return BadRequest(result.Message);
        return Ok(result);
    }

    [HttpPost("update")]
    public async Task<IActionResult> UpdateAsync([FromBody] Collection args)
    {
        var result = await _collectionService.UpdateAsync(args);
        if (!result.Succeeded) return BadRequest(result.Message);
        return Ok(result);
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeleteAsync([FromBody] Collection args) => Ok(await _collectionService.DeleteAsync(args));

    [HttpGet("list-by-catalog")]
    public async Task<IActionResult> ListByCatalogAsync([FromQuery] ListCatalogCollectionFilterOptions filterOptions) => Ok(await _collectionService.ListByCatalogAsync(filterOptions));

    [HttpGet("list-catalog")]
    public async Task<IActionResult> GetListCatalogAsync([FromQuery] ListCatalogByCollectionFilterOptions filterOptions) => Ok(await _collectionService.ListCatalogByCollectionAsync(filterOptions));

    [HttpPost("delete-catalog")]
    public async Task<IActionResult> DeleteCatalogAsync([FromBody] Collection args) => Ok(await _collectionService.DeleteCatalogAsync(args));
}
