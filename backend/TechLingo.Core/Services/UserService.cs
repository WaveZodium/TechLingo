using System;
using System.Collections.Generic;
using System.Text;
using TechLingo.Core.DTOs;
using TechLingo.Core.Entities;
using TechLingo.Core.Interfaces;

namespace TechLingo.Core.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserProfileDto?> GetUserByIdAsync(string userId)
        {
            User? user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
            {
                return null;
            }

            return new UserProfileDto
            {
                Username = user.Username,
                TotalScore = user.TotalScore
            };
        }
        public async Task<bool> DeleteUserAsync(string userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
            {
                return false;
            }

            await _userRepository.DeleteAsync(userId);

            return true;
        }
    }
}
