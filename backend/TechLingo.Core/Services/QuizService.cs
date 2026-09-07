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
        // Ett färdigt quiz ska innehålla exakt 10 svar.
    if (completeQuizDto.Answers.Count != 10)
        return null;

    // Ser till att samma fråga inte skickats flera gånger.
    var answers = completeQuizDto.Answers
        .GroupBy(answer => answer.questionId)
        .ToDictionary(
            group => group.Key,
            group => group.Last()
        );

    if (answers.Count != 10)
        return null;

    var quizScore = 0;

    foreach (var submittedAnswer in answers.Values)
    {
        var question = await _questionRepository
            .GetByIdAsync(submittedAnswer.questionId);

        if (question is null)
            return null;

        // Frågan måste tillhöra quizets kategori.
        if (question.CategoryId != completeQuizDto.CategoryId)
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

    // Totalpoängen får aldrig gå under 0.
    var newTotalScore = Math.Max(
        0,
        user.TotalScore + quizScore
    );

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