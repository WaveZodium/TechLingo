using TechLingo.Core.DTOs;
using TechLingo.Core.Entities;
using TechLingo.Core.Repositories;

namespace TechLingo.Core.Services;

public class QuestionService
{
    private readonly QuestionRepository _questionRepository;

    public QuestionService(QuestionRepository questionRepository)
    {
        _questionRepository = questionRepository;
    }

    public async Task<List<QuestionDto>> GetAllAsync()
    {
        var questions = await _questionRepository.GetAllAsync();

        return questions
            .Select(MapToDto)
            .ToList();
    }

    public async Task<QuestionDto?> GetByIdAsync(string id)
    {
        var question = await _questionRepository.GetByIdAsync(id);

        if (question is null)
            return null;

        return MapToDto(question);
    }

    public async Task<List<QuestionDto>> GetByCategoryAsync(string categoryId)
    {
        var questions =
        await _questionRepository.GetRandomByCategoryAsync(
            categoryId,
            10
        );

    return questions
        .Select(MapToDto)
        .ToList();
    }

    public async Task<AnswerResultDto?> ValidateAnswerAsync(
        SubmitAnswerDto submitAnswerDto)
    {
        var question = await _questionRepository
            .GetByIdAsync(submitAnswerDto.questionId);

        if (question is null)
            return null;

        var selectedOption = question.Options.FirstOrDefault(
            option => option.Id == submitAnswerDto.answerId);

        if (selectedOption is null)
            return null;

        var correctOption = question.Options.FirstOrDefault(
            option => option.IsCorrect);

        var isCorrect = selectedOption.IsCorrect;

        return new AnswerResultDto
        {
            IsCorrect = isCorrect,
            Points = isCorrect ? 100 : -200,
            CorrectAnswer = isCorrect
                ? selectedOption.Text
                : correctOption?.Text,
            CorrectAnswerId = isCorrect
                ? selectedOption.Id
                : correctOption?.Id,
            ErrorMessage = isCorrect
                ? null
                : $"'{selectedOption.Text}' is wrong! The correct answer is '{correctOption?.Text}'."
        };
    }

    private static QuestionDto MapToDto(Question question)
    {
        return new QuestionDto
        {
            Id = question.Id,
            CategoryId = question.CategoryId,
            Message = question.Message,
            Prompt = question.Prompt,

            Options = question.Options
                .Select(option => new AnswerOptionDto
                {
                    Id = option.Id,
                    Text = option.Text
                })
                .ToList()
        };
    }
}