namespace TechLingo.Core.DTOs
{
    public class CompleteQuizDto
    {
        public string CategoryId { get; set; } = string.Empty;

        public List<SubmitAnswerDto> Answers { get; set; } = [];
    }
}