using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TechLingo.Core.Entities;

namespace TechLingo.Core.Interfaces
{
    public interface IUserRepository
    {
        Task<List<User>> GetAllAsync();
        Task<User?> GetByIdAsync(string id);
        Task<User?> GetByUsernameAsync(string username);
        Task CreateAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(string id);
        Task<int?> AddPointsAsync(string userId, int points);

    }
}
