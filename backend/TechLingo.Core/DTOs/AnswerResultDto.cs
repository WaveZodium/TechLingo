using System;
using System.Collections.Generic;
using System.Text;

namespace TechLingo.Core.DTOs
{
    public class AnswerResultDto
    {
        public bool IsCorrect { get; set; }
        public int Points { get; set; }
        public int TotalScore { get; set; }
        public string? CorrectAnswer { get; set; }
        public string? CorrectAnswerId { get; set; }
        public string? ErrorMessage { get; set; }
    }
}
