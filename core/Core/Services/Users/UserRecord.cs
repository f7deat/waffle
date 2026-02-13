namespace Waffle.Core.Services.Users;

public record ChangeAvatarArgs(
    Guid UserId,
    IFormFile File
);

public record ChangeAvatarProfileArgs(IFormFile File);