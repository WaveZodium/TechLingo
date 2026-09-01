using System;
using System.Collections.Generic;
using System.Text;
using TechLingo.Core.Entities;

namespace TechLingo.Core.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByUsernameAsync(string username);
        Task CreateAsync(User user);
    }
}
