using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TechLingo.Core.DTOs.Admin;
using TechLingo.Core.Entities;
using TechLingo.Core.Interfaces;

namespace TechLingo.Core.Services
{
    public class AdminService : IAdminService
    {
        private readonly IUserRepository _userRepository;

        public AdminService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<List<UserDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return users.Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Role = u.Role
            }).ToList();
        }

        public async Task<UserDto?> GetUserByIdAsync(string id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return null;
            }

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role
            };
        }

        public async Task<UserDto> CreateUserAsync(CreateUserDto createUserDto)
        {
            var existingUser = await _userRepository.GetByUsernameAsync(createUserDto.Username);
            if (existingUser != null)
            {
                throw new InvalidOperationException("Användarnamnet upptaget.");
            }

            var user = new User
            {
                Username = createUserDto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(createUserDto.Password),
                Role = createUserDto.Role
            };

            await _userRepository.CreateAsync(user);

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role
            };
        }

        public async Task<UserDto?> UpdateUserAsync(string id, UpdateUserDto updateUserDto)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return null;
            }

            user.Username = updateUserDto.Username;
            user.Role = updateUserDto.Role;

            await _userRepository.UpdateAsync(user);

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role
            };
        }

        public async Task<bool> DeleteUserAsync(string id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return false;
            }

            await _userRepository.DeleteAsync(id);
            return true;
        }

        public async Task<bool> ChangePasswordAsync(string id, ChangePasswordDto changePasswordDto)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return false;
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);
            await _userRepository.UpdateAsync(user);
            return true;
        }
    }
}
