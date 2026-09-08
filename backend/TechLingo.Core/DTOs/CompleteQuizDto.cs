namespace TechLingo.Core.DTOs
{
    public class CompleteQuizDto
    {
        //Ta bort?
        public string CategoryId { get; set; } = string.Empty;

        public List<SubmitAnswerDto> Answers { get; set; } = [];
    }
}