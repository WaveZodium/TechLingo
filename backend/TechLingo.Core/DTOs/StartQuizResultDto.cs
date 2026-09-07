namespace TechLingo.Core.DTOs;

public class StartQuizResultDto
{
    // representerar resultatet av att starta ett nytt quiz
    public string SessionId { get; set; } = string.Empty;

    public List<QuestionDto> Questions { get; set; } = [];
}