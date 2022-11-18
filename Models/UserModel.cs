namespace Waffle.Models
{
    public class LoginModel
    {
        public LoginModel()
        {
            UserName = string.Empty;
            Password = string.Empty;
        }
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}
