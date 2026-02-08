using Waffle.Entities;

namespace Waffle.Models;

public class LoginModel
{
    public string? UserName { get; set; }
    public string? Password { get; set; }
}

public class ChangePasswordModel
{
    public string? CurrentPassword { get; set; }
    public string? NewPassword { get; set; }
}

public class CreateUserModel : LoginModel
{
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
}

public class AddToRoleModel : BaseEntity
{
    public string? RoleName { get; set; }
}

public class RemoveFromRoleModel : BaseEntity
{
    public string? RoleName { get; set; }
}
