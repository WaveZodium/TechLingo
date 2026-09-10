using System;
using System.Collections.Generic;
using System.Text;

namespace TechLingo.Core.DTOs
{
    public class UserProfileDto
    {
        public string Username { get; set; } = string.Empty;
        public int TotalScore { get; set; } = 0;
    }
}
