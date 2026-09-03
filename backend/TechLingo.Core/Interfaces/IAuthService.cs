using System;
using System.Collections.Generic;
using System.Text;
using TechLingo.Core.DTOs;

namespace TechLingo.Core.Interfaces
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterRequestDto request);
        Task<string> LoginAsync(LoginRequestDto request);
    }
}
