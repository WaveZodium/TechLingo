namespace TechLingo.Core.DTOs.Admin
{
    public class PatchQuestionDto
    {
        public string? CategoryId { get; set; }
        public string? Message { get; set; }
        public string? Prompt { get; set; }
        public List<AdminAnswerOptionDto>? Options { get; set; }
        public string? Explanation { get; set; }
        public bool? IsActive { get; set; }
    }
}
