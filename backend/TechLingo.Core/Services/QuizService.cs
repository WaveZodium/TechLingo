using TechLingo.Core.DTOs;
using TechLingo.Core.Interfaces;
using TechLingo.Core.Repositories;

namespace TechLingo.Core.Services;

public class QuizService
{
    private readonly QuestionRepository _questionRepository;
    private readonly IUserRepository _userRepository;

    public QuizService(
        QuestionRepository questionRepository,
        IUserRepository userRepository)
    {
        _questionRepository = questionRepository;
        _userRepository = userRepository;
    }

    public async Task<QuizResultDto?> CompleteQuizAsync(
        string userId,
        CompleteQuizDto completeQuizDto)
    {
        var questions = await _questionRepository
            .GetByCategoryAsync(completeQuizDto.CategoryId);

        if (questions.Count == 0)
            return null;

        // Ser till att varje fråga bara förekommer en gång.
        var answers = completeQuizDto.Answers
            .GroupBy(answer => answer.questionId)
            .ToDictionary(
                group => group.Key,
                group => group.Last()
            );

        // Alla frågor i quizet måste vara besvarade.
        if (answers.Count != questions.Count)
            return null;

        var quizScore = 0;

        foreach (var question in questions)
        {
            if (!answers.TryGetValue(question.Id, out var submittedAnswer))
                return null;

            var selectedOption = question.Options.FirstOrDefault(
                option => option.Id == submittedAnswer.answerId);

            if (selectedOption is null)
                return null;

            quizScore += selectedOption.IsCorrect
                ? 100
                : -200;
        }

        var user = await _userRepository.GetByIdAsync(userId);

        if (user is null)
            return null;

        // Användarens TOTALA poäng får aldrig gå under 0.
        var newTotalScore = Math.Max(
            0,
            user.TotalScore + quizScore
        );

        // Hur mycket TotalScore faktiskt ska ändras.
        var scoreChange =
            newTotalScore - user.TotalScore;

        var totalScore = await _userRepository.AddPointsAsync(
            userId,
            scoreChange
        );

        if (totalScore is null)
            return null;

        return new QuizResultDto
        {
            QuizScore = quizScore,
            TotalScore = totalScore.Value
        };
    }
}