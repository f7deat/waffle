using Microsoft.AspNetCore.Identity;
using Waffle.Core.IServices.Users;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Entities.Users;
using Waffle.Models;
using Waffle.Models.ViewModels.Users;

namespace Waffle.Core.Services;

public class UserService(UserManager<ApplicationUser> _userManager, RoleManager<ApplicationRole> _roleManager, ApplicationDbContext _context) : IUserService
{
    private async Task<ApplicationUser?> FindAsync(Guid id) => await _context.Users.FindAsync(id);

    public async Task<IdentityResult> AddToRoleAsync(Guid userId, string roleName)
    {
        var user = await FindAsync(userId);
        if (user is null)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Description = "User not found!"
            });
        }
        if (!await _roleManager.RoleExistsAsync(roleName))
        {
            return IdentityResult.Failed(new IdentityError
            {
                Description = "Role not found!"
            });
        }
        return await _userManager.AddToRoleAsync(user, roleName);
    }

    public async Task<IdentityResult> ChangePasswordAsync(ChangePasswordModel args)
    {
        var user = await FindAsync(args.Id);
        if (user is null)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "UserNotFound",
                Description = "User not found!"
            });
        }
        if (string.IsNullOrWhiteSpace(args.CurrentPassword) || string.IsNullOrWhiteSpace(args.NewPassword)) return IdentityResult.Failed();
        return await _userManager.ChangePasswordAsync(user, args.CurrentPassword, args.NewPassword);
    }

    public async Task<IdentityResult> CreateAsync(CreateUserModel model)
    {
        if (string.IsNullOrWhiteSpace(model.Password)) return IdentityResult.Failed();
        return await _userManager.CreateAsync(new ApplicationUser
        {
            Email = model.Email,
            UserName = model.UserName,
            PhoneNumber = model.PhoneNumber
        }, model.Password);
    }

    public async Task<CurrentUserViewModel?> GetCurrentUserAsync(Guid id)
    {
        var user = await FindAsync(id);
        if (user is null) return default;
        return new CurrentUserViewModel
        {
            Id = user.Id,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            UserName = user.UserName ?? string.Empty,
            Name = user.Name,
            Roles = await _userManager.GetRolesAsync(user)
        };
    }

    public async Task<dynamic> GetUsersInRoleAsync(string roleName)
    {
        var data = await _userManager.GetUsersInRoleAsync(roleName);
        return new
        {
            data,
            total = data.Count,
        };
    }

    public async Task<ListResult<Contact>> ListContactAsync(SearchFilterOptions filterOptions)
    {
        var query = _context.Contacts.OrderByDescending(x => x.CreatedDate);
        return await ListResult<Contact>.Success(query, filterOptions);
    }

    public async Task<IdentityResult> RemoveFromRoleAsync(Guid userId, string roleName)
    {
        var user = await FindAsync(userId);
        if (user is null)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Description = "User not found!"
            });
        }
        return await _userManager.RemoveFromRoleAsync(user, roleName);
    }

    public async Task<IdentityResult> UpdateAsync(ApplicationUser user, ApplicationUser args)
    {
        user.Name = args.Name;
        user.Gender = args.Gender;
        user.Address = args.Address;
        user.DateOfBirth = args.DateOfBirth;
        await _userManager.UpdateAsync(user);
        return IdentityResult.Success;
    }

    public async Task<ListResult> GetInfluencersAsync(FilterOptions filterOptions)
    {
        var query = from u in _context.Users
                    join ur in _context.UserRoles on u.Id equals ur.UserId
                    join r in _context.Roles on ur.RoleId equals r.Id
                    where r.Name == "Influencer"
                    select new
                    {
                        u.Id,
                        u.UserName,
                        u.Email,
                        u.Name,
                        Followers = 0,
                        u.Avatar,
                        u.PhoneNumberConfirmed,
                        ReviewCount = 0,
                        Rating = 5,
                        PricePerReview = 0,
                    };
        return await ListResult.Success(query, filterOptions);
    }
}
