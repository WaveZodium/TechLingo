using TechLingo.Core.DTOs;
using TechLingo.Core.Entities;
using TechLingo.Core.Interfaces;
using TechLingo.Core.Repositories;

namespace TechLingo.Core.Services;

public class QuizService
{
    private const int MaxTotalScore = 99999;
    private readonly QuestionService _questionService;
    private readonly IUserRepository _userRepository;
    private readonly QuizSessionRepository _quizSessionRepository;
    private readonly CategoryService _categoryService;

    public QuizService(
        QuestionService questionService,
        IUserRepository userRepository,
        QuizSessionRepository quizSessionRepository,
        CategoryService categoryService)
    {
        _questionService = questionService;
        _userRepository = userRepository;
        _quizSessionRepository = quizSessionRepository;
        _categoryService = categoryService;
    }

    // startar ett nytt quiz för en användare inom en viss kategori
    public async Task<StartQuizResultDto?> StartQuizAsync(
        string userId,
        string categoryId)
    {
        var activeSession =
        await _quizSessionRepository.GetActiveSessionAsync(
            userId,
            categoryId
        );

    if (activeSession is not null)
    {
        var existingQuestions = new List<QuestionDto>();

        foreach (var questionId in activeSession.QuestionIds)
        {
            var question =
                await _questionService.GetByIdAsync(questionId);

            if (question is null)
                return null;

            existingQuestions.Add(question);
        }

        return new StartQuizResultDto
        {
            SessionId = activeSession.Id,
            Questions = existingQuestions,
            AnsweredQuestionIds = activeSession.Answers
                .Select(answer => answer.QuestionId)
                .ToList(),
            CurrentScore = activeSession.Score,
            IsResumed = true
        };
    }

        var category =
            await _categoryService.GetActiveByIdAsync(categoryId);

        if (category is null || !category.IsActive)
            return null;

        var questions =
        await _questionService.GetByCategoryAsync(categoryId);

    if (questions.Count != 10)
        return null;

    foreach (var question in questions)
    {
        question.Options = question.Options
            .OrderBy(_ => Guid.NewGuid())
            .ToList();
    }

    var quizSession = new QuizSession
    {
        UserId = userId,
        CategoryId = categoryId,
        QuestionIds = questions
            .Select(question => question.Id)
            .ToList()
    };

    await _quizSessionRepository.CreateAsync(quizSession);

    return new StartQuizResultDto
    {
        SessionId = quizSession.Id,
        Questions = questions,
        AnsweredQuestionIds = [],
        CurrentScore = 0,
        IsResumed = false
    };
    }

    // skickar ett svar på en fråga inom en pågående quizsession
    public async Task<AnswerResultDto?> SubmitAnswerAsync(
        string sessionId,
        string userId,
        SubmitAnswerDto submitAnswerDto)
    {
        var session =
            await _quizSessionRepository.GetByIdAsync(sessionId);

        if (session is null)
            return null;

        if (session.UserId != userId)
            return null;

        if (session.IsCompleted)
            return null;

        if (!session.QuestionIds.Contains(
                submitAnswerDto.questionId))
        {
            return null;
        }

        if (session.Answers.Any(
                answer =>
                    answer.QuestionId ==
                    submitAnswerDto.questionId))
        {
            return null;
        }

        var result =
            await _questionService.ValidateAnswerAsync(
                submitAnswerDto
            );

        if (result is null)
            return null;

        var sessionAnswer = new QuizSessionAnswer
        {
            QuestionId = submitAnswerDto.questionId,
            AnswerId = submitAnswerDto.answerId,
            IsCorrect = result.IsCorrect,
            Points = result.Points
        };

        var answerSaved =
            await _quizSessionRepository.AddAnswerAsync(
                sessionId,
                sessionAnswer
            );

        if (!answerSaved)
            return null;

        return result;
    }

    // avslutar ett pågående quiz och beräknar resultatet
    public async Task<QuizResultDto?> CompleteQuizAsync(
        string sessionId,
        string userId)
    {
        var session =
            await _quizSessionRepository.GetByIdAsync(sessionId);

        if (session is null)
            return null;

        if (session.UserId != userId)
            return null; // säkerställer att endast användaren som startade quizet kan avsluta det

        if (session.IsCompleted)
            return null;

        if (session.Answers.Count != 10) // säkerställer att alla frågor har besvarats innan quiz avslutas
            return null;

        var user =
            await _userRepository.GetByIdAsync(userId); // hämtar användaren som genomför quizet

        if (user is null)
            return null;
        // markerar quizsessionen som avslutad och beräknar poängen
        var completedSession =
            await _quizSessionRepository.CompleteAsync(
                sessionId
            );

        if (completedSession is null)
            return null;

        var quizScore = completedSession.Score;
        // beräknar den nya totala poängen för användaren efter quizet
        var newTotalScore = Math.Clamp(
            user.TotalScore + quizScore,
            0,
            MaxTotalScore
        );

        var scoreChange =
            newTotalScore - user.TotalScore;
        // uppdaterar användarens totala poäng med förändringen
        var totalScore =
            await _userRepository.AddPointsAsync(
                userId,
                scoreChange
            );

        if (totalScore is null)
            return null;
        // returnerar resultatet av quizet inklusive poängen användaren fick och den nya totala poängen
        return new QuizResultDto
        {
            QuizScore = quizScore,
            TotalScore = totalScore.Value
        };
    }

    public async Task<List<QuizHistoryDto>> GetQuizHistoryAsync(
    string userId,
    int count = 5)
    {
        var sessions =
            await _quizSessionRepository
                .GetLatestCompletedByUserAsync(userId, count);

        return sessions
            .Select(session => new QuizHistoryDto
            {
                SessionId = session.Id,
                CategoryId = session.CategoryId,
                QuizScore = session.Score,
                CorrectAnswers = session.Answers.Count(
                    answer => answer.IsCorrect
                ),
                TotalQuestions = session.QuestionIds.Count,
                CompletedAt = session.CompletedAt
            })
            .ToList();
    }

    public async Task<bool> QuitQuizAsync(
        string sessionId,
        string userId)
    {
        var session =
            await _quizSessionRepository.GetByIdAsync(sessionId);

        if (session is null)
            return false;

        // Endast användaren som äger sessionen får radera den.
        if (session.UserId != userId)
            return false;

        // Färdiga quiz ska inte kunna raderas via Quit.
        if (session.IsCompleted)
            return false;

        return await _quizSessionRepository.DeleteAsync(sessionId);
    }
}