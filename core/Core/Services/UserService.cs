using Microsoft.AspNetCore.Identity;
using Waffle.Core.Constants;
using Waffle.Core.Foundations.Models;
using Waffle.Core.IServices.Users;
using Waffle.Core.Services.Users;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Entities.Users;
using Waffle.Models;
using Waffle.Models.ViewModels.Users;

namespace Waffle.Core.Services;

public class UserService(UserManager<ApplicationUser> _userManager, RoleManager<ApplicationRole> _roleManager, ApplicationDbContext _context) : IUserService
{
    private async Task<ApplicationUser?> FindAsync(Guid id) => await _context.Users.FindAsync(id);

    public async Task<TResult> AddToRoleAsync(Guid userId, string roleName)
    {
        var user = await FindAsync(userId);
        if (user is null) return TResult.Failed("User not found!");
        if (!await _roleManager.RoleExistsAsync(roleName)) return TResult.Failed("Role does not exist!");
        var result = await _userManager.AddToRoleAsync(user, roleName);
        return result.Succeeded ? TResult.Success : TResult.Failed(result.Errors.FirstOrDefault()?.Description ?? "Failed to add user to role.");
    }

    public async Task<TResult> ChangePasswordAsync(ChangePasswordModel args)
    {
        var user = await FindAsync(args.Id);
        if (user is null) return TResult.Failed("User not found!");
        if (string.IsNullOrWhiteSpace(args.CurrentPassword) || string.IsNullOrWhiteSpace(args.NewPassword)) return TResult.Failed("Password is required");
        var result = await _userManager.ChangePasswordAsync(user, args.CurrentPassword, args.NewPassword);
        return result.Succeeded ? TResult.Success : TResult.Failed(result.Errors.FirstOrDefault()?.Description ?? "Password change failed.");
    }

    public async Task<TResult> CreateAsync(CreateUserModel model)
    {
        if (string.IsNullOrWhiteSpace(model.Password)) return TResult.Failed("Password is required!");
        var result = await _userManager.CreateAsync(new ApplicationUser
        {
            Email = model.Email,
            UserName = model.UserName,
            PhoneNumber = model.PhoneNumber
        }, model.Password);
        return result.Succeeded ? TResult.Success : TResult.Failed(result.Errors.FirstOrDefault()?.Description ?? "User creation failed.");
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

    public async Task<TResult> RemoveFromRoleAsync(Guid userId, string roleName)
    {
        var user = await FindAsync(userId);
        if (user is null) return TResult.Failed("User not found!");
        var result = await _userManager.RemoveFromRoleAsync(user, roleName);
        return result.Succeeded ? TResult.Success : TResult.Failed(result.Errors.FirstOrDefault()?.Description ?? "Failed to remove user from role.");
    }

    public async Task<TResult> UpdateAsync(ApplicationUser user, ApplicationUser args)
    {
        user.Name = args.Name;
        user.Gender = args.Gender;
        user.Address = args.Address;
        user.DateOfBirth = args.DateOfBirth;
        await _userManager.UpdateAsync(user);
        return TResult.Success;
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

    public async Task<TResult> BecomeInfluencerAsync(BecomeInfluencerArgs args)
    {
        var user = new ApplicationUser
        {
            Name = args.FullName,
            Email = args.Email,
            PhoneNumber = args.PhoneNumber,
            UserName = args.PhoneNumber,
            Gender = args.Gender,
            DateOfBirth = args.DateOfBirth,
        };
        var result = await _userManager.CreateAsync(user, args.Password);
        if (result.Succeeded)
        {
            await _userManager.AddToRoleAsync(user, RoleName.Influencer);
        }
        return result.Succeeded ? TResult.Success : TResult.Failed(result.Errors.FirstOrDefault()?.Description ?? "Failed to create influencer account.");
    }
}
