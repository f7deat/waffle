using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;

namespace Waffle.Core.Services;

public class ShortLinkService(ApplicationDbContext context) : IShortLinkService
{
    private readonly ApplicationDbContext _context = context;
    private const int CodeLength = 7;
    private const int MaxGenerateRetry = 20;
    private static readonly char[] _alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".ToCharArray();

    public async Task<TResult> CreateAsync(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri)
            || (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps))
        {
            return TResult.Failed("Invalid URL");
        }

        var normalizedUrl = uri.ToString();
        var existed = await _context.ShortLinks
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.OriginalUrl == normalizedUrl);
        if (existed is not null)
        {
            return TResult.Ok(existed);
        }

        var code = await GenerateUniqueCodeAsync();
        if (string.IsNullOrWhiteSpace(code))
        {
            return TResult.Failed("Cannot generate short code");
        }

        var entity = new ShortLink
        {
            Code = code,
            OriginalUrl = normalizedUrl,
            CreatedDate = DateTime.UtcNow,
        };

        await _context.ShortLinks.AddAsync(entity);
        await _context.SaveChangesAsync();
        return TResult.Ok(entity);
    }

    public async Task<IReadOnlyList<ShortLink>> ListAsync()
    {
        return await _context.ShortLinks
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedDate)
            .Take(100)
            .ToListAsync();
    }

    public async Task<TResult> DeleteAsync(Guid id)
    {
        var entity = await _context.ShortLinks.FindAsync(id);
        if (entity is null)
        {
            return TResult.Failed("Short link not found");
        }

        _context.ShortLinks.Remove(entity);
        await _context.SaveChangesAsync();
        return TResult.Success;
    }

    public async Task<TResult> ClearAsync()
    {
        var entities = await _context.ShortLinks.ToListAsync();
        if (entities.Count == 0)
        {
            return TResult.Success;
        }

        _context.ShortLinks.RemoveRange(entities);
        await _context.SaveChangesAsync();
        return TResult.Success;
    }

    public async Task<ShortLink?> GetByCodeAsync(string code)
    {
        return await _context.ShortLinks.FirstOrDefaultAsync(x => x.Code == code);
    }

    public async Task TrackAccessAsync(Guid id)
    {
        var entity = await _context.ShortLinks.FindAsync(id);
        if (entity is null)
        {
            return;
        }

        entity.ClickCount += 1;
        entity.LastAccessedDate = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    private async Task<string?> GenerateUniqueCodeAsync()
    {
        for (var i = 0; i < MaxGenerateRetry; i++)
        {
            var code = GenerateCode(CodeLength);
            var existed = await _context.ShortLinks.AsNoTracking().AnyAsync(x => x.Code == code);
            if (!existed)
            {
                return code;
            }
        }

        return null;
    }

    private static string GenerateCode(int length)
    {
        Span<byte> bytes = stackalloc byte[length];
        RandomNumberGenerator.Fill(bytes);
        var result = new char[length];

        for (var i = 0; i < length; i++)
        {
            result[i] = _alphabet[bytes[i] % _alphabet.Length];
        }

        return new string(result);
    }
}
