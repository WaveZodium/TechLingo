using TechLingo.Core.DTOs;
using TechLingo.Core.Entities;
using TechLingo.Core.Interfaces;
using TechLingo.Core.Repositories;

namespace TechLingo.Core.Services;

public class QuizService
{
    private readonly QuestionService _questionService;
    private readonly IUserRepository _userRepository;
    private readonly QuizSessionRepository _quizSessionRepository;

    public QuizService(
        QuestionService questionService,
        IUserRepository userRepository,
        QuizSessionRepository quizSessionRepository)
    {
        _questionService = questionService;
        _userRepository = userRepository;
        _quizSessionRepository = quizSessionRepository;
    }

    public async Task<StartQuizResultDto?> StartQuizAsync(
        string userId,
        string categoryId)
    {
        var questions =
            await _questionService.GetByCategoryAsync(categoryId);

        if (questions.Count != 10)
            return null;

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
            Questions = questions
        };
    }

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

    public async Task<QuizResultDto?> CompleteQuizAsync(
        string sessionId,
        string userId)
    {
        var session =
            await _quizSessionRepository.GetByIdAsync(sessionId);

        if (session is null)
            return null;

        if (session.UserId != userId)
            return null;

        if (session.IsCompleted)
            return null;

        if (session.Answers.Count != 10)
            return null;

        var user =
            await _userRepository.GetByIdAsync(userId);

        if (user is null)
            return null;

        var completedSession =
            await _quizSessionRepository.CompleteAsync(
                sessionId
            );

        if (completedSession is null)
            return null;

        var quizScore = completedSession.Score;

        var newTotalScore = Math.Max(
            0,
            user.TotalScore + quizScore
        );

        var scoreChange =
            newTotalScore - user.TotalScore;

        var totalScore =
            await _userRepository.AddPointsAsync(
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