namespace Waffle.Core.Services.Users;

public record BecomeInfluencerArgs(
    string FullName,
    string Email,
    string PhoneNumber,
    bool? Gender,
    DateOnly? DateOfBirth,
    string Password
);

