using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Constants;
using Waffle.Core.Helpers;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.IServices.Users;
using Waffle.Core.Services.Users;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Entities.Users;
using Waffle.Models;
using Waffle.Models.Args.Users;
using Waffle.Models.ViewModels.Users;
using Waffle.Modules.Users.Interfaces;

namespace Waffle.Core.Services;

public class UserService(UserManager<ApplicationUser> _userManager, IUserRepository _userRepository, IFileService _fileService, IHCAService _hcaService, IWebHostEnvironment _webHostEnvironment, RoleManager<ApplicationRole> _roleManager, ApplicationDbContext _context) : IUserService
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
        var user = await _userManager.FindByIdAsync(_hcaService.GetUserId().ToString());
        if (user is null) return TResult.Failed("User not found!");
        if (string.IsNullOrWhiteSpace(args.CurrentPassword) || string.IsNullOrWhiteSpace(args.NewPassword)) return TResult.Failed("Password is required");
        var result = await _userManager.ChangePasswordAsync(user, args.CurrentPassword, args.NewPassword);
        return result.Succeeded ? TResult.Success : TResult.Failed(result.Errors.FirstOrDefault()?.Description ?? "Password change failed.");
    }

    public async Task<TResult> CreateAsync(CreateUserModel model)
    {
        if (string.IsNullOrWhiteSpace(model.Password)) return TResult.Failed("Password is required!");
        var user = new ApplicationUser
        {
            Email = model.Email,
            UserName = model.UserName,
            PhoneNumber = model.PhoneNumber
        };
        var result = await _userManager.CreateAsync(user, model.Password);
        if (!result.Succeeded) return TResult.Failed(result.Errors.FirstOrDefault()?.Description ?? "User creation failed.");
        var allowedRoles = new List<string> { RoleName.Member, RoleName.Influencer, RoleName.Business };
        if (!allowedRoles.Contains(model.AccountType)) return TResult.Failed("Invalid account type.");
        await _userManager.AddToRoleAsync(user, model.AccountType);
        return TResult.Success;
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
            Roles = await _userManager.GetRolesAsync(user),
            EmailConfirmed = user.EmailConfirmed,
            Avatar = user.Avatar,
            Amount = user.Amount,
            Gender = user.Gender,
            DateOfBirth = user.DateOfBirth
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
        if (string.IsNullOrWhiteSpace(args.UserName)) return TResult.Failed("User name is required.");
        if (args.UserName.Length > 256 || args.Email?.Length > 256 || args.PhoneNumber?.Length > 256)
            return TResult.Failed("User name, email, and phone number must not exceed 256 characters.");
        if (args.Name?.Length > 256 || args.Address?.Length > 512 || args.Avatar?.Length > 2058 || args.Bio?.Length > 1024)
            return TResult.Failed("One or more profile fields exceed the maximum allowed length.");
        if (args.AccessFailedCount < 0) return TResult.Failed("Access failed count cannot be negative.");
        if (args.DistrictId.HasValue && !await _context.Districts.AnyAsync(x => x.Id == args.DistrictId.Value))
            return TResult.Failed("District not found.");
        if (args.TeamId.HasValue && !await _context.Teams.AnyAsync(x => x.Id == args.TeamId.Value))
            return TResult.Failed("Team not found.");

        user.UserName = args.UserName.Trim();
        user.Email = string.IsNullOrWhiteSpace(args.Email) ? null : args.Email.Trim();
        user.PhoneNumber = string.IsNullOrWhiteSpace(args.PhoneNumber) ? null : args.PhoneNumber.Trim();
        user.Name = args.Name?.Trim();
        user.Gender = args.Gender;
        user.Address = args.Address;
        user.DateOfBirth = args.DateOfBirth;
        user.Amount = args.Amount;
        user.Avatar = args.Avatar;
        user.DistrictId = args.DistrictId;
        user.TeamId = args.TeamId;
        user.Bio = args.Bio;
        user.EmailConfirmed = args.EmailConfirmed;
        user.PhoneNumberConfirmed = args.PhoneNumberConfirmed;
        user.TwoFactorEnabled = args.TwoFactorEnabled;
        user.LockoutEnabled = args.LockoutEnabled;
        user.LockoutEnd = args.LockoutEnd;
        user.AccessFailedCount = args.AccessFailedCount;

        var result = await _userManager.UpdateAsync(user);
        return result.Succeeded
            ? TResult.Success
            : TResult.Failed(string.Join(" ", result.Errors.Select(error => error.Description)));
    }

    public async Task<TResult> UpdateProfileAsync(ApplicationUser user, ApplicationUser args)
    {
        user.Name = args.Name;
        user.Gender = args.Gender;
        user.Address = args.Address;
        user.DateOfBirth = args.DateOfBirth;

        var result = await _userManager.UpdateAsync(user);
        return result.Succeeded
            ? TResult.Success
            : TResult.Failed(string.Join(" ", result.Errors.Select(error => error.Description)));
    }

    public async Task<ProfileDetailViewModel?> GetProfileDetailAsync(Guid userId)
    {
        var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Id == userId);
        if (user is null) return null;
        var areas = await _context.UserActivityAreas.AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderBy(x => x.Province!.Name)
            .Select(x => new ProfileAreaViewModel { Id = x.ProvinceId, Name = x.Province!.Name })
            .ToListAsync();
        var tags = await _context.UserTags.AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderBy(x => x.Tag!.Name)
            .Select(x => new ProfileTagViewModel { Id = x.TagId, Name = x.Tag!.Name })
            .ToListAsync();
        var socialAccounts = await GetSocialAccountsAsync(userId);
        var appUser = await _userManager.FindByIdAsync(userId.ToString()) ?? user;
        var roles = await _userManager.GetRolesAsync(appUser);
        var influencer = roles.Contains(RoleName.Influencer)
            ? await _context.InfluencerProfiles.AsNoTracking().FirstOrDefaultAsync(x => x.UserId == userId) ?? new InfluencerProfile { UserId = userId }
            : null;
        var business = roles.Contains(RoleName.Business)
            ? await _context.BusinessProfiles.AsNoTracking().FirstOrDefaultAsync(x => x.UserId == userId) ?? new BusinessProfile { UserId = userId }
            : null;

        var filled = new List<bool>
        {
            !string.IsNullOrWhiteSpace(user.Name),
            !string.IsNullOrWhiteSpace(user.Avatar),
            !string.IsNullOrWhiteSpace(user.CoverImage),
            !string.IsNullOrWhiteSpace(user.Tagline),
            !string.IsNullOrWhiteSpace(user.Bio),
            areas.Count > 0,
            socialAccounts.Count > 0
        };
        if (influencer is not null)
        {
            filled.Add(tags.Count > 0);
            filled.Add(!string.IsNullOrWhiteSpace(influencer.BookingEmail));
            filled.Add(!string.IsNullOrWhiteSpace(influencer.MediaKitUrl));
        }
        if (business is not null)
        {
            filled.Add(!string.IsNullOrWhiteSpace(business.CompanyName));
            filled.Add(!string.IsNullOrWhiteSpace(business.TaxCode));
            filled.Add(!string.IsNullOrWhiteSpace(business.ContactEmail));
        }

        return new ProfileDetailViewModel
        {
            Id = user.Id,
            UserName = user.UserName ?? string.Empty,
            Name = user.Name,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Avatar = user.Avatar,
            CoverImage = user.CoverImage,
            Tagline = user.Tagline,
            Bio = user.Bio,
            ShowFavoritePlacesOnMap = user.ShowFavoritePlacesOnMap,
            NotifyOnComments = user.NotifyOnComments,
            ProvinceName = areas.FirstOrDefault()?.Name,
            Roles = roles,
            Completeness = filled.Count(x => x) * 100 / filled.Count,
            ActivityAreas = areas,
            Tags = tags,
            SocialAccounts = socialAccounts,
            Influencer = influencer is null ? null : new InfluencerProfileViewModel
            {
                IsOpenForBooking = influencer.IsOpenForBooking,
                BookingEmail = influencer.BookingEmail,
                BookingPhone = influencer.BookingPhone,
                MediaKitUrl = influencer.MediaKitUrl,
                MediaKitName = influencer.MediaKitName,
                MediaKitSize = influencer.MediaKitSize,
                MediaKitUpdatedAt = influencer.MediaKitUpdatedAt,
                ShowEngagementStats = influencer.ShowEngagementStats
            },
            Business = business is null ? null : new BusinessProfileViewModel
            {
                CompanyName = business.CompanyName,
                TaxCode = business.TaxCode,
                BusinessType = business.BusinessType,
                RepresentativeName = business.RepresentativeName,
                Website = business.Website,
                ContactEmail = business.ContactEmail,
                ContactPhone = business.ContactPhone,
                BusinessAddress = business.BusinessAddress,
                Description = business.Description,
                IsVerified = business.IsVerified
            }
        };
    }

    public async Task<TResult> UpdateProfileDetailAsync(Guid userId, UpdateProfileDetailArgs args)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user is null) return TResult.Failed("User not found!");
        if (string.IsNullOrWhiteSpace(args.Name)) return TResult.Failed("Name is required.");
        if (string.IsNullOrWhiteSpace(args.UserName)) return TResult.Failed("User name is required.");

        foreach (var account in args.SocialAccounts)
        {
            if (account.SocialPlatformId == Guid.Empty) return TResult.Failed("Social platform is required.");
            if (account.FollowersCount < 0) return TResult.Failed("Followers count cannot be negative.");
            if (!Uri.TryCreate(account.ProfileUrl?.Trim(), UriKind.Absolute, out var uri)
                || (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps))
                return TResult.Failed("Profile URL must be an absolute HTTP or HTTPS URL.");
            account.ProfileUrl = account.ProfileUrl!.Trim();
        }

        var provinceIds = args.ProvinceIds.Distinct().ToList();
        if (provinceIds.Count > 0 && await _context.Provinces.CountAsync(x => provinceIds.Contains(x.Id)) != provinceIds.Count)
            return TResult.Failed("One or more provinces do not exist.");

        var tagNames = args.Tags
            .Select(x => x.Trim().TrimStart('#').Trim())
            .Where(x => x.Length > 0)
            .Select(x => x.Length > 256 ? x[..256] : x)
            .GroupBy(x => SeoHelper.ToSeoFriendly(x))
            .Select(x => x.First())
            .Take(20)
            .ToList();

        var userName = args.UserName.Trim().TrimStart('@');
        if (!string.Equals(user.UserName, userName, StringComparison.Ordinal))
        {
            var nameResult = await _userManager.SetUserNameAsync(user, userName);
            if (!nameResult.Succeeded) return TResult.Failed(string.Join(" ", nameResult.Errors.Select(e => e.Description)));
        }

        user.Name = args.Name.Trim();
        user.Tagline = args.Tagline?.Trim();
        user.Bio = args.Bio?.Trim();
        user.ShowFavoritePlacesOnMap = args.ShowFavoritePlacesOnMap;
        user.NotifyOnComments = args.NotifyOnComments;
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded) return TResult.Failed(string.Join(" ", result.Errors.Select(e => e.Description)));

        var roles = await _userManager.GetRolesAsync(user);
        if (args.Influencer is not null && roles.Contains(RoleName.Influencer))
        {
            var profile = await _context.InfluencerProfiles.FindAsync(userId);
            if (profile is null)
            {
                profile = new InfluencerProfile { UserId = userId };
                _context.InfluencerProfiles.Add(profile);
            }
            profile.IsOpenForBooking = args.Influencer.IsOpenForBooking;
            profile.BookingEmail = NullIfBlank(args.Influencer.BookingEmail);
            profile.BookingPhone = NullIfBlank(args.Influencer.BookingPhone);
            profile.ShowEngagementStats = args.Influencer.ShowEngagementStats;
        }
        if (args.Business is not null && roles.Contains(RoleName.Business))
        {
            var profile = await _context.BusinessProfiles.FindAsync(userId);
            if (profile is null)
            {
                profile = new BusinessProfile { UserId = userId };
                _context.BusinessProfiles.Add(profile);
            }
            var b = args.Business;
            profile.CompanyName = NullIfBlank(b.CompanyName);
            profile.TaxCode = NullIfBlank(b.TaxCode);
            profile.BusinessType = NullIfBlank(b.BusinessType);
            profile.RepresentativeName = NullIfBlank(b.RepresentativeName);
            profile.Website = NullIfBlank(b.Website);
            profile.ContactEmail = NullIfBlank(b.ContactEmail);
            profile.ContactPhone = NullIfBlank(b.ContactPhone);
            profile.BusinessAddress = NullIfBlank(b.BusinessAddress);
            profile.Description = NullIfBlank(b.Description);
        }

        var verifiedPlatforms = await _context.SocialAccounts
            .Where(x => x.UserId == userId && x.IsVerified)
            .Select(x => x.SocialPlatformId)
            .ToListAsync();
        foreach (var account in args.SocialAccounts)
            account.IsVerified = verifiedPlatforms.Contains(account.SocialPlatformId);

        var oldAreas = await _context.UserActivityAreas.Where(x => x.UserId == userId).ToListAsync();
        _context.UserActivityAreas.RemoveRange(oldAreas.Where(x => !provinceIds.Contains(x.ProvinceId)));
        _context.UserActivityAreas.AddRange(provinceIds
            .Where(id => oldAreas.All(x => x.ProvinceId != id))
            .Select(id => new UserActivityArea { UserId = userId, ProvinceId = id }));

        var normalized = tagNames.ToDictionary(x => SeoHelper.ToSeoFriendly(x));
        var normalizedKeys = normalized.Keys.ToList();
        var existingTags = await _context.Tags.Where(x => normalizedKeys.Contains(x.NormalizedName)).ToListAsync();
        var tagIds = new List<Guid>();
        foreach (var (key, name) in normalized)
        {
            var tag = existingTags.FirstOrDefault(x => x.NormalizedName == key);
            if (tag is null)
            {
                tag = new Entities.Tags.Tag { Name = name, NormalizedName = key };
                _context.Tags.Add(tag);
            }
            tagIds.Add(tag.Id);
        }
        await _context.SaveChangesAsync();

        var oldTags = await _context.UserTags.Where(x => x.UserId == userId).ToListAsync();
        _context.UserTags.RemoveRange(oldTags.Where(x => !tagIds.Contains(x.TagId)));
        _context.UserTags.AddRange(tagIds
            .Where(id => oldTags.All(x => x.TagId != id))
            .Select(id => new UserTag { UserId = userId, TagId = id }));
        await _context.SaveChangesAsync();

        if (!await UpdateSocialAccountsAsync(userId, args.SocialAccounts))
            return TResult.Failed("Invalid social accounts.");
        return TResult.Success;
    }

    private static string? NullIfBlank(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    private static readonly string[] ImageExtensions = [".jpg", ".jpeg", ".png", ".webp"];

    private async Task<(string? Url, string? Error)> SaveProfileFileAsync(Guid userId, IFormFile? file, string host, string[] extensions, long maxBytes)
    {
        if (file is null || file.Length == 0) return (null, "Invalid file.");
        if (file.Length > maxBytes) return (null, $"File must not exceed {maxBytes / 1024 / 1024}MB.");
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!extensions.Contains(extension)) return (null, "Unsupported file type.");
        var folder = Path.Combine(_webHostEnvironment.WebRootPath, "profile", userId.ToString());
        Directory.CreateDirectory(folder);
        var fileName = $"{Guid.NewGuid():N}{extension}";
        await using (var stream = new FileStream(Path.Combine(folder, fileName), FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }
        return ($"{host}/profile/{userId}/{fileName}", null);
    }

    public async Task<TResult> ChangeCoverAsync(Guid userId, IFormFile? file, string host)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user is null) return TResult.Failed("User not found!");
        var (url, error) = await SaveProfileFileAsync(userId, file, host, ImageExtensions, 5 * 1024 * 1024);
        if (url is null) return TResult.Failed(error!);
        user.CoverImage = url;
        await _context.SaveChangesAsync();
        return TResult.Success;
    }

    public async Task<TResult> RemoveCoverAsync(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user is null) return TResult.Failed("User not found!");
        user.CoverImage = null;
        await _context.SaveChangesAsync();
        return TResult.Success;
    }

    public async Task<TResult> UploadMediaKitAsync(Guid userId, IFormFile? file, string host)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user is null) return TResult.Failed("User not found!");
        if (!await _userManager.IsInRoleAsync(user, RoleName.Influencer)) return TResult.Failed("Only influencers can upload a media kit.");
        var (url, error) = await SaveProfileFileAsync(userId, file, host, [".pdf"], 20 * 1024 * 1024);
        if (url is null) return TResult.Failed(error!);
        var profile = await _context.InfluencerProfiles.FindAsync(userId);
        if (profile is null)
        {
            profile = new InfluencerProfile { UserId = userId };
            _context.InfluencerProfiles.Add(profile);
        }
        var fileName = Path.GetFileName(file!.FileName);
        profile.MediaKitUrl = url;
        profile.MediaKitName = fileName.Length > 256 ? fileName[..256] : fileName;
        profile.MediaKitSize = file.Length;
        profile.MediaKitUpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return TResult.Success;
    }

    public Task<List<SocialAccountViewModel>> GetSocialAccountsAsync(Guid userId) => _context.SocialAccounts
        .AsNoTracking()
        .Where(account => account.UserId == userId)
        .OrderBy(account => account.SocialPlatform!.Name)
        .Select(account => new SocialAccountViewModel
        {
            SocialPlatformId = account.SocialPlatformId,
            SocialPlatformName = account.SocialPlatform!.Name,
            ProfileUrl = account.ProfileUrl,
            FollowersCount = account.FollowersCount,
            IsVerified = account.IsVerified
        })
        .ToListAsync();

    public async Task<bool> UpdateSocialAccountsAsync(Guid userId, IReadOnlyCollection<UpdateSocialAccountArgs> accounts)
    {
        var platformIds = accounts.Select(account => account.SocialPlatformId).ToList();
        if (platformIds.Distinct().Count() != platformIds.Count) return false;

        var existingPlatformIds = await _context.SocialPlatforms
            .Where(platform => platformIds.Contains(platform.Id))
            .Select(platform => platform.Id)
            .ToListAsync();
        if (existingPlatformIds.Count != platformIds.Count) return false;

        var existingAccounts = await _context.SocialAccounts
            .Where(account => account.UserId == userId)
            .ToListAsync();
        var accountsByPlatform = accounts.ToDictionary(account => account.SocialPlatformId);

        foreach (var existingAccount in existingAccounts)
        {
            if (!accountsByPlatform.TryGetValue(existingAccount.SocialPlatformId, out var updatedAccount))
            {
                _context.SocialAccounts.Remove(existingAccount);
                continue;
            }

            existingAccount.ProfileUrl = updatedAccount.ProfileUrl.Trim();
            existingAccount.FollowersCount = updatedAccount.FollowersCount;
            existingAccount.IsVerified = updatedAccount.IsVerified;
        }

        foreach (var account in accounts)
        {
            if (existingAccounts.Any(existing => existing.SocialPlatformId == account.SocialPlatformId)) continue;

            _context.SocialAccounts.Add(new SocialAccount
            {
                UserId = userId,
                SocialPlatformId = account.SocialPlatformId,
                ProfileUrl = account.ProfileUrl.Trim(),
                FollowersCount = account.FollowersCount,
                IsVerified = account.IsVerified
            });
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<ListResult> GetInfluencersAsync(FilterOptions filterOptions)
    {
        var query = from u in _context.Users
                    join ur in _context.UserRoles on u.Id equals ur.UserId
                    join r in _context.Roles on ur.RoleId equals r.Id
                    join d in _context.Districts on u.DistrictId equals d.Id into ud
                    from d in ud.DefaultIfEmpty()
                    join p in _context.Provinces on d.ProvinceId equals p.Id into dp
                    from p in dp.DefaultIfEmpty()
                    where r.Name == RoleName.Influencer
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
                        u.EmailConfirmed,
                        ProvinceName = p.Name,
                        ProvinceId = (int?)p.Id
                    };
        return await ListResult.Success(query, filterOptions);
    }

    public async Task<TResult> BecomeInfluencerAsync(BecomeInfluencerArgs args)
    {
        try
        {
            var user = new ApplicationUser
            {
                Name = args.FullName,
                Email = args.Email,
                PhoneNumber = args.PhoneNumber,
                UserName = args.UserName,
                Gender = args.Gender,
                DateOfBirth = args.DateOfBirth,
                DistrictId = args.DistrictId,
                CreatedAt = DateTime.UtcNow
            };
            var result = await _userManager.CreateAsync(user, args.Password);
            if (!result.Succeeded) return TResult.Failed(result.Errors.FirstOrDefault()?.Description ?? "Failed to create influencer account.");
            await _userManager.AddToRoleAsync(user, RoleName.Influencer);
            return TResult.Success;
        }
        catch (Exception ex)
        {
            return TResult.Failed(ex.ToString());
        }
    }

    public async Task<TResult> ChangeAvatarAsync(ChangeAvatarArgs args, string host)
    {
        if (args.File is null || args.File.Length == 0) return TResult.Failed("Invalid file.");
        try
        {
            var user = await _context.Users.FindAsync(args.UserId);
            if (user is null) return TResult.Failed("User not found!");
            if (!_hcaService.IsUserInRole(RoleName.Admin) && user.Id != _hcaService.GetUserId()) return TResult.Failed("Unauthoried");
            var folderPath = Path.Combine(_webHostEnvironment.WebRootPath, "avatar", user.UserName ?? user.Id.ToString());
            if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);
            using var fileStream = new FileStream(Path.Combine(folderPath, args.File.FileName), FileMode.Create);
            await args.File.CopyToAsync(fileStream);
            await _context.FileContents.AddAsync(new Entities.Files.FileContent
            {
                Name = args.File.FileName,
                Size = args.File.Length,
                Type = args.File.ContentType,
                UploadDate = DateTime.Now,
                UploadBy = args.UserId,
                Url = $"{host}/avatar/{user.UserName}/{args.File.FileName}"
            });
            user.Avatar = $"{host}/avatar/{user.UserName}/{args.File.FileName}";
            await _context.SaveChangesAsync();
            return TResult.Success;
        }
        catch (Exception ex)
        {
            return TResult.Failed(ex.ToString());
        }
    }

    public async Task<TResult> GetByUserNameAsync(string userName)
    {
        var user = await _userManager.FindByNameAsync(userName);
        if (user is null) return TResult.Failed("User not found!");
        var address = await (from a in _context.Users
                             join d in _context.Districts on a.DistrictId equals d.Id into ad
                             from d in ad.DefaultIfEmpty()
                             join p in _context.Provinces on d.ProvinceId equals p.Id into dp
                             from p in dp.DefaultIfEmpty()
                             where a.Id == user.Id
                             select new
                             {
                                 ProvinceName = p != null ? p.Name : string.Empty,
                                 DistrictName = d != null ? d.Name : string.Empty
                             }).FirstOrDefaultAsync();
        return TResult.Ok(new
        {
            user.Id,
            user.UserName,
            user.Name,
            user.Avatar,
            user.EmailConfirmed,
            user.PhoneNumberConfirmed,
            user.DateOfBirth,
            user.Gender,
            user.CreatedAt,
            user.DistrictId,
            address?.ProvinceName,
            address?.DistrictName
        });
    }

    public async Task<object?> GetInfluencerOptionsAsync(SelectOptions selectOptions)
    {
        var query = from u in _context.Users
                    join ur in _context.UserRoles on u.Id equals ur.UserId
                    join r in _context.Roles on ur.RoleId equals r.Id
                    where r.Name == RoleName.Influencer
                    select new
                    {
                        u.Id,
                        u.Name,
                        u.UserName,
                        u.Avatar
                    };
        if (!string.IsNullOrWhiteSpace(selectOptions.KeyWords))
        {
            selectOptions.KeyWords = selectOptions.KeyWords.Trim().ToLower();
            query = query.Where(x => x.Name.ToLower().Contains(selectOptions.KeyWords) || x.UserName.ToLower().Contains(selectOptions.KeyWords));
        }
        return await query.Select(x => new { Label = x.Name, x.Avatar, x.UserName, Value = x.Id }).ToListAsync();
    }

    private async Task<TResult> TopupInternalAsync(Guid userId, decimal amount, string? note, Guid createdBy)
    {
        if (amount <= 0) return TResult.Failed("Số tiền nạp phải lớn hơn 0.");

        var user = await _context.Users.FindAsync(userId);
        if (user is null) return TResult.Failed("User not found!");

        var balanceBefore = user.Amount;
        user.Amount += amount;

        var transaction = new UserTopupTransaction
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Amount = amount,
            BalanceBefore = balanceBefore,
            BalanceAfter = user.Amount,
            InvoiceNumber = $"INV-{DateTime.UtcNow:yyyyMMddHHmmss}-{Random.Shared.Next(100, 999)}",
            Note = string.IsNullOrWhiteSpace(note) ? null : note.Trim(),
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow,
        };

        await _context.UserTopupTransactions.AddAsync(transaction);
        await _context.SaveChangesAsync();

        return TResult.Ok(new
        {
            transaction.Id,
            transaction.InvoiceNumber,
            transaction.Amount,
            transaction.BalanceBefore,
            transaction.BalanceAfter,
            transaction.CreatedAt
        });
    }

    public async Task<TResult> TopupAsync(AdminTopupArgs args, Guid adminId)
    {
        return await TopupInternalAsync(args.UserId, args.Amount, args.Note, adminId);
    }

    public async Task<ListResult<UserTopupTransactionViewModel>> GetTopupHistoryAsync(Guid userId, BasicFilterOptions filterOptions)
    {
        var query = from t in _context.UserTopupTransactions
                    join a in _context.Users on t.CreatedBy equals a.Id into adminJoin
                    from admin in adminJoin.DefaultIfEmpty()
                    where t.UserId == userId
                    orderby t.CreatedAt descending
                    select new UserTopupTransactionViewModel
                    {
                        Id = t.Id,
                        UserId = t.UserId,
                        Amount = t.Amount,
                        BalanceBefore = t.BalanceBefore,
                        BalanceAfter = t.BalanceAfter,
                        InvoiceNumber = t.InvoiceNumber,
                        Note = t.Note,
                        CreatedBy = t.CreatedBy,
                        CreatedByName = admin != null ? (admin.Name ?? admin.UserName) : null,
                        CreatedAt = t.CreatedAt,
                    };

        return await ListResult<UserTopupTransactionViewModel>.Success(query, filterOptions);
    }

    public async Task<TResult> GetTopupStatsAsync(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user is null) return TResult.Failed("User not found!");

        var query = _context.UserTopupTransactions.Where(x => x.UserId == userId);
        var now = DateTime.UtcNow;
        var monthStart = new DateTime(now.Year, now.Month, 1);

        var stats = new UserTopupStatsViewModel
        {
            UserId = userId,
            CurrentBalance = user.Amount,
            TotalTopup = await query.SumAsync(x => x.Amount),
            ThisMonthTopup = await query.Where(x => x.CreatedAt >= monthStart).SumAsync(x => x.Amount),
            TopupCount = await query.CountAsync(),
            LastTopupAt = await query.OrderByDescending(x => x.CreatedAt).Select(x => (DateTime?)x.CreatedAt).FirstOrDefaultAsync(),
        };

        return TResult.Ok(stats);
    }

    public async Task<TResult> GetTopupInvoiceAsync(Guid transactionId)
    {
        var query = from t in _context.UserTopupTransactions
                    join u in _context.Users on t.UserId equals u.Id
                    join a in _context.Users on t.CreatedBy equals a.Id into adminJoin
                    from admin in adminJoin.DefaultIfEmpty()
                    where t.Id == transactionId
                    select new UserTopupInvoiceViewModel
                    {
                        TransactionId = t.Id,
                        InvoiceNumber = t.InvoiceNumber,
                        UserId = u.Id,
                        UserName = u.Name ?? u.UserName,
                        UserEmail = u.Email,
                        Amount = t.Amount,
                        BalanceBefore = t.BalanceBefore,
                        BalanceAfter = t.BalanceAfter,
                        Note = t.Note,
                        CreatedAt = t.CreatedAt,
                        CreatedBy = t.CreatedBy,
                        CreatedByName = admin != null ? (admin.Name ?? admin.UserName) : null,
                    };

        var invoice = await query.FirstOrDefaultAsync();
        if (invoice is null) return TResult.Failed("Hóa đơn không tồn tại.");
        return TResult.Ok(invoice);
    }

    public async Task<TResult> GetDetailAsync(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user is null) return TResult.Failed("User not found!");

        return TResult.Ok(new
        {
            user.Id,
            user.UserName,
            user.Name,
            user.Email,
            user.PhoneNumber,
            user.Avatar,
            user.Gender,
            user.DateOfBirth,
            user.Address,
            user.Amount,
            user.DistrictId,
            user.TeamId,
            user.Bio,
            user.CreatedAt,
            user.EmailConfirmed,
            user.PhoneNumberConfirmed,
            user.TwoFactorEnabled,
            user.LockoutEnabled,
            user.LockoutEnd,
            user.AccessFailedCount
        });
    }

    public async Task<TResult> GetRolesAsync(Guid userId)
    {
        var query = from ur in _context.UserRoles
                    join r in _context.Roles on ur.RoleId equals r.Id
                    where ur.UserId == userId
                    select new
                    {
                        r.Id,
                        r.Name,
                        r.DisplayName
                    };
        return TResult.Ok(await query.ToListAsync());
    }

    public async Task<TResult> DeleteAsync(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null) return TResult.Failed("User not found!");
        if (!string.IsNullOrWhiteSpace(user.Avatar)) return await _fileService.DeletePathAsync(user.Avatar);
        return TResult.Success;
    }

    public Task<ListResult> GetRandomInfluencersAsync(FilterOptions filterOptions) => _userRepository.GetRandomInfluencersAsync(filterOptions);
}
