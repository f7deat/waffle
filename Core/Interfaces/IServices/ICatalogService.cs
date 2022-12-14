using Microsoft.AspNetCore.Identity;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IServices
{
    public interface ICatalogService
    {
        Task<IdentityResult> AddAsync(Catalog catalog);
        Task<Catalog> EnsureDataAsync(string name);
        Task<PageVewModel> GetPageDataAsync(Catalog catalog);
    }
}
