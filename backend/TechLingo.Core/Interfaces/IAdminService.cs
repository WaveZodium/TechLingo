using System.Collections.Generic;
using System.Threading.Tasks;
using TechLingo.Core.DTOs.Admin;

namespace TechLingo.Core.Interfaces
{
    public interface IAdminService
    {
        Task<List<UserDto>> GetAllUsersAsync();
        Task<UserDto?> GetUserByIdAsync(string id);
        Task<UserDto> CreateUserAsync(CreateUserDto createUserDto);
        Task<UserDto?> UpdateUserAsync(string id, UpdateUserDto updateUserDto);
        Task<bool> DeleteUserAsync(string id);
        Task<bool> ChangePasswordAsync(string id, ChangePasswordDto changePasswordDto);
    }
}
