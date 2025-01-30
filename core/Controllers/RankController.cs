using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Models.Components;
using Waffle.Modules.Ranks.Models;

namespace Waffle.Controllers;

public class RankController(ApplicationDbContext _context, IWorkService _workService) : BaseController
{
    [HttpPost("add-item")]
    public async Task<IActionResult> AddItemAsync([FromBody] AddItemArgs args)
    {
        var work = await _context.WorkContents.FindAsync(args.WorkId);
        if (work is null) return BadRequest(args.WorkId);
        var rank = await _workService.GetAsync<Rank>(args.WorkId);
        if (rank is null) return BadRequest("Rank not found");
        rank.Items ??= [];
        rank.Items.Add(new RankItem
        {
            Id = Guid.NewGuid(),
            Name = args.Name,
            Thumbnail = args.Thumbnail,
            Rating = 0
        });
        work.Arguments = JsonSerializer.Serialize(rank);
        _context.WorkContents.Update(work);
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("delete-item")]
    public async Task<IActionResult> DeleteAsync([FromBody] DeleteItemArgs args)
    {
        var work = await _context.WorkContents.FindAsync(args.WorkId);
        if (work is null) return BadRequest(args.WorkId);
        var rank = await _workService.GetAsync<Rank>(args.WorkId);
        if (rank is null) return BadRequest("Rank not found");
        if (rank.Items == null) return BadRequest("Rank items not found");
        rank.Items.RemoveAll(x => x.Id == args.Id);
        work.Arguments = JsonSerializer.Serialize(rank);
        _context.WorkContents.Update(work);
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpPost("vote"), AllowAnonymous]
    public async Task<IActionResult> VoteAsync(VoteArgs args)
    {
        try
        {
            if (User.Identity?.IsAuthenticated is false) return Redirect("/user/login");
            var work = await _context.WorkContents.FindAsync(args.WorkId);
            if (work is null) return BadRequest(args.WorkId);
            var rank = await _workService.GetAsync<Rank>(args.WorkId);
            if (rank is null) return BadRequest("Rank not found");
            if (rank.Items == null) return BadRequest("Rank items not found");
            var rankItem = rank.Items.FirstOrDefault(x => x.Id == args.RankId);
            if (rankItem is null) return BadRequest("Rank item not found");
            rankItem.Rating++;
            work.Arguments = JsonSerializer.Serialize(rank);
            _context.WorkContents.Update(work);
            await _context.SaveChangesAsync();

            var catalog = await _context.Catalogs.FindAsync(args.CatalogId);
            if (catalog is null) return BadRequest(args.CatalogId);

            return Redirect($"/leaf/{catalog.NormalizedName}");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.ToString());
        }
    }
}
