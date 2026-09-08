using System;
using System.Collections.Generic;
using System.Text;
using TechLingo.Core.DTOs;

namespace TechLingo.Core.Interfaces
{
    public interface IUserService
    {
        Task<UserProfileDto?> GetUserByIdAsync(string userId);
        Task<bool> DeleteUserAsync(string userId);
    }
}
