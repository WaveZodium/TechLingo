namespace TechLingo.Core.DTOs.Admin
{
    public class AdminAnswerOptionDto
    {
        public string Id { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
    }
}
