using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TechLingo.Core.DTOs;

namespace TechLingo.Core.Interfaces
{
    public interface IUserService
    {
        Task<UserProfileDto?> GetUserByIdAsync(string userId);
        Task<bool> DeleteUserAsync(string userId);
        Task<List<LeaderboardUserDto>> GetLeaderboardAsync();
    }
}
