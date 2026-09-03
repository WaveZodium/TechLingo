using System;
using System.Collections.Generic;
using System.Text;

namespace TechLingo.Core.DTOs
{
    public class RegisterRequestDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
