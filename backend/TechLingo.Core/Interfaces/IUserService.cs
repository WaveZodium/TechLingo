using System;
using System.Collections.Generic;
using System.Text;

namespace TechLingo.Core.Interfaces
{
    public interface IUserService
    {
        Task<bool> DeleteUserAsync(string userId);
    }
}
