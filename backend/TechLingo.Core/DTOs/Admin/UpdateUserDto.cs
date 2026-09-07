using TechLingo.Core.Enums;

namespace TechLingo.Core.DTOs.Admin
{
    public class UpdateUserDto
    {
        public string Username { get; set; } = string.Empty;
        public UserRole Role { get; set; } = UserRole.User;
    }
}
