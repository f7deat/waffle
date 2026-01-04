namespace Waffle.Core.Services.Users;

public record ChangeAvatarArgs(
    Guid UserId,
    IFormFile File
);