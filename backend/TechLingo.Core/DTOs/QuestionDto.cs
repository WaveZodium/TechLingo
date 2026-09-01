namespace TechLingo.Core.DTOs
{
    public class QuestionDto
    {
        public string Id { get; set; } = string.Empty;
        public string CategoryId { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Prompt { get; set; } = string.Empty;

        public List<AnswerOptionDto> Options { get; set; } = [];
    }
}