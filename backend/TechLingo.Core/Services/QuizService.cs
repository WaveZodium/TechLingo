using TechLingo.Core.DTOs;
using TechLingo.Core.Entities;
using TechLingo.Core.Interfaces;
using TechLingo.Core.Repositories;

namespace TechLingo.Core.Services;

public class QuizService
{
    private const int MaxQuestionsPerQuiz = 10;
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

    // Startar ett nytt quiz för en användare inom en viss kategori
    public async Task<StartQuizResultDto?> StartQuizAsync(
        string userId,
        string categoryId)
    {
        var activeSession =
            await _quizSessionRepository.GetActiveSessionAsync(
                userId,
                categoryId
            );

        // Om användaren redan har en aktiv session för kategorin
        // återupptas den i stället för att skapa en ny.
        if (activeSession is not null)
        {
            var existingQuestions = new List<QuestionDto>();

            foreach (var questionId in activeSession.QuestionIds)
            {
                var question =
                    await _questionService.GetByIdAsync(questionId);

                if (question is null)
                {
                    return null;
                }

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
        {
            return null;
        }

        var questions =
            await _questionService.GetByCategoryAsync(categoryId);

        // Ett quiz måste innehålla minst en fråga.
        if (questions.Count == 0)
        {
            return null;
        }

        // Slumpa frågorna och använd maximalt 10.
        // Om kategorin innehåller färre än 10 används alla.
        questions = questions
            .OrderBy(_ => Guid.NewGuid())
            .Take(MaxQuestionsPerQuiz)
            .ToList();

        // Slumpa även svarsalternativen för varje fråga.
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

    // Skickar ett svar på en fråga inom en pågående quizsession
    public async Task<AnswerResultDto?> SubmitAnswerAsync(
        string sessionId,
        string userId,
        SubmitAnswerDto submitAnswerDto)
    {
        var session =
            await _quizSessionRepository.GetByIdAsync(sessionId);

        if (session is null)
        {
            return null;
        }

        if (session.UserId != userId)
        {
            return null;
        }

        if (session.IsCompleted)
        {
            return null;
        }

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
        {
            return null;
        }

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
        {
            return null;
        }

        return result;
    }

    // Avslutar ett pågående quiz och beräknar resultatet
    public async Task<QuizResultDto?> CompleteQuizAsync(
        string sessionId,
        string userId)
    {
        var session =
            await _quizSessionRepository.GetByIdAsync(sessionId);

        if (session is null)
        {
            return null;
        }

        // Säkerställer att endast användaren som startade
        // quizet kan avsluta det.
        if (session.UserId != userId)
        {
            return null;
        }

        if (session.IsCompleted)
        {
            return null;
        }

        // Alla frågor som hör till sessionen måste vara
        // besvarade innan quizet kan avslutas.
        if (session.Answers.Count != session.QuestionIds.Count)
        {
            return null;
        }

        var user =
            await _userRepository.GetByIdAsync(userId);

        if (user is null)
        {
            return null;
        }

        // Markerar quizsessionen som avslutad
        // och beräknar poängen.
        var completedSession =
            await _quizSessionRepository.CompleteAsync(
                sessionId
            );

        if (completedSession is null)
        {
            return null;
        }

        var quizScore = completedSession.Score;

        // Beräknar användarens nya totalpoäng
        // men tillåter aldrig mer än maxpoängen.
        var newTotalScore = Math.Clamp(
            user.TotalScore + quizScore,
            0,
            MaxTotalScore
        );

        var scoreChange =
            newTotalScore - user.TotalScore;

        var totalScore =
            await _userRepository.AddPointsAsync(
                userId,
                scoreChange
            );

        if (totalScore is null)
        {
            return null;
        }

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
                .GetLatestCompletedByUserAsync(
                    userId,
                    count
                );

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
        {
            return false;
        }

        // Endast användaren som äger sessionen
        // får radera den.
        if (session.UserId != userId)
        {
            return false;
        }

        // Färdiga quiz ska inte kunna raderas via Quit.
        if (session.IsCompleted)
        {
            return false;
        }

        return await _quizSessionRepository.DeleteAsync(sessionId);
    }
}