using Microsoft.AspNetCore.Identity;
using Waffle.Core.Constants;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.ViewModels;
using Waffle.Models.ViewModels.Users;

namespace Waffle.Core.Services;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly ApplicationDbContext _context;

    public UserService(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager, ApplicationDbContext context)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _context = context;
    }

    private async Task<ApplicationUser?> FindAsync(Guid id) => await _context.Users.FindAsync(id);

    public async Task<IdentityResult> AddToRoleAsync(AddToRoleModel model)
    {
        var user = await FindAsync(model.Id);
        if (user is null)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Description = "User not found!"
            });
        }
        if (!await _roleManager.RoleExistsAsync(model.RoleName))
        {
            return IdentityResult.Failed(new IdentityError
            {
                Description = "Role not found!"
            });
        }
        return await _userManager.AddToRoleAsync(user, model.RoleName);
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
        return await _userManager.ChangePasswordAsync(user, args.CurrentPassword, args.NewPassword);
    }

    public async Task<IdentityResult> CreateAsync(CreateUserModel model)
    {
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
            UserName = user.UserName,
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

    public async Task<IdentityResult> RemoveFromRoleAsync(RemoveFromRoleModel args)
    {
        var user = await FindAsync(args.Id);
        if (user is null)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Description = "User not found!"
            });
        }
        return await _userManager.RemoveFromRoleAsync(user, args.RoleName);
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
}
