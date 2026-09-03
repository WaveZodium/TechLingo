using System;
using System.Collections.Generic;
using System.Text;

namespace TechLingo.Core.DTOs
{
    public class SubmitAnswerDto
    {
        public string questionId { get; set; } = string.Empty;
        public string answerId { get; set; } = string.Empty;
    }
}
