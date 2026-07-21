namespace Waffle.Core.Services.Users;

public record ChangeAvatarArgs(
    Guid UserId,
    IFormFile File
);

public record ChangeAvatarProfileArgs(IFormFile File);

public record ResetPasswordArgs(Guid UserId, string NewPassword);

public record AdminTopupArgs(Guid UserId, decimal Amount, string? Note);

public record ProfileTopupArgs(decimal Amount, string? Note);