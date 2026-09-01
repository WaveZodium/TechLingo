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
            await _questionRepository.GetByCategoryAsync(categoryId);

        return questions
            .Select(MapToDto)
            .ToList();
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