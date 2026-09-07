using TechLingo.Core.Enums;

namespace TechLingo.Core.DTOs.Admin
{
    public class CreateUserDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public UserRole Role { get; set; } = UserRole.User;
    }
}
