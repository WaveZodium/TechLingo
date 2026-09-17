using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
        public async Task<List<LeaderboardUserDto>> GetLeaderboardAsync()
        {
            var users = await _userRepository.GetTopUsersAsync(5);

            return users
                .Select(user => new LeaderboardUserDto
                {
                    Username = user.Username,
                    TotalScore = user.TotalScore
                })
                .ToList();
        }

    }
}
