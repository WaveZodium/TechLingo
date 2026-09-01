using System;
using System.Collections.Generic;
using System.Text;
using TechLingo.Core.DTOs;

namespace TechLingo.Core.Interfaces
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterDto request);
        Task<string> LoginAsync(LoginDto request);
    }
}
