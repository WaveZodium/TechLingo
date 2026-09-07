namespace TechLingo.Core.DTOs;

public class StartQuizResultDto
{
    public string SessionId { get; set; } = string.Empty;

    public List<QuestionDto> Questions { get; set; } = [];
}