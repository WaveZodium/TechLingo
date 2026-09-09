using System;
using System.Collections.Generic;
using System.Text;

namespace TechLingo.Core.DTOs
{
    public class QuizHistoryDto
    {
        public string SessionId { get; set; } = string.Empty;

        public string CategoryId { get; set; } = string.Empty;

        public int QuizScore { get; set; }

        public int CorrectAnswers { get; set; }

        public int TotalQuestions { get; set; }

        public DateTime? CompletedAt { get; set; }
    }
}

