namespace Waffle.Models
{
    public abstract class UserEntity
    {
        public string? Id { get; set; }
    }
    public class LoginModel
    {
        public string? UserName { get; set; }
        public string? Password { get; set; }
    }

    public class ChangePasswordModel : UserEntity
    {
        public string? CurrentPassword { get; set; }
        public string? NewPassword { get; set; }
    }

    public class CreateUserModel
    {
        public string? Email { get; set; }
        public string? UserName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Password { get; set; }
    }

    public class AddToRoleModel : UserEntity
    {
        public string? RoleName { get; set; }
    }

    public class RemoveFromRoleModel : UserEntity
    {
        public string? RoleName { get; set; }
    }
}
