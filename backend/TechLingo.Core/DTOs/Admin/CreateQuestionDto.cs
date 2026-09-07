namespace TechLingo.Core.DTOs.Admin
{
    public class CreateQuestionDto
    {
        public string CategoryId { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Prompt { get; set; } = string.Empty;
        public List<AdminAnswerOptionDto> Options { get; set; } = [];
        public string? Explanation { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
