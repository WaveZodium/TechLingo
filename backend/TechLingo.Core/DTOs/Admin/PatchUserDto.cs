using TechLingo.Core.Enums;

namespace TechLingo.Core.DTOs.Admin
{
    public class PatchUserDto
    {
        public string? Username { get; set; }
        public UserRole? Role { get; set; }
    }
}
