using System;
using System.Collections.Generic;
using System.Text;
using TechLingo.Core.Entities;

namespace TechLingo.Core.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(User user);
    }
}
