using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities.Ranks;
using Waffle.Models;
using Waffle.Models.Components;
using Waffle.Modules.Ranks.Models;

namespace Waffle.Controllers;

public class RankController(ApplicationDbContext _context, IWorkService _workService) : Controller
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

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
    {
        var rank = await _context.RankItems.FindAsync(id);
        if (rank is null) return BadRequest("Rank not found");
        var reviews = await _context.RankReviews.Where(x => x.RankItemId == id).ToListAsync();
        if (reviews.Count != 0)
        {
            _context.RankReviews.RemoveRange(reviews);
        }
        _context.RankItems.Remove(rank);
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpPost("vote")]
    public async Task<IActionResult> VoteAsync([FromBody] VoteArgs args)
    {
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
        return Ok();
    }
}
