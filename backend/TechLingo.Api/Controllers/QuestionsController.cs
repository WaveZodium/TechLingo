using Microsoft.AspNetCore.Mvc;
using TechLingo.Core.DTOs;
using TechLingo.Core.Repositories;

namespace TechLingo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuestionsController : ControllerBase
{
    private readonly QuestionRepository _repository;

    public QuestionsController(QuestionRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<List<QuestionDto>>> GetAll()
    {
        var questions = await _repository.GetAllAsync();

        var result = questions.Select(q => new QuestionDto
        {
            Id = q.Id,
            CategoryId = q.CategoryId,
            Message = q.Message,
            Prompt = q.Prompt,

            Options = q.Options.Select(o => new AnswerOptionDto
            {
                Id = o.Id,
                Text = o.Text
            }).ToList()
        }).ToList();

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<QuestionDto>> GetById(string id)
    {
        var question = await _repository.GetByIdAsync(id);

        if (question is null)
            return NotFound();

        var result = new QuestionDto
        {
            Id = question.Id,
            CategoryId = question.CategoryId,
            Message = question.Message,
            Prompt = question.Prompt,

            Options = question.Options.Select(o => new AnswerOptionDto
            {
                Id = o.Id,
                Text = o.Text
            }).ToList()
        };

        return Ok(result);
    }

    [HttpGet("category/{categoryId}")]
    public async Task<ActionResult<List<QuestionDto>>> GetByCategory(
        string categoryId)
    {
        var questions =
            await _repository.GetByCategoryAsync(categoryId);

        var result = questions.Select(q => new QuestionDto
        {
            Id = q.Id,
            CategoryId = q.CategoryId,
            Message = q.Message,
            Prompt = q.Prompt,

            Options = q.Options.Select(o => new AnswerOptionDto
            {
                Id = o.Id,
                Text = o.Text
            }).ToList()
        }).ToList();

        return Ok(result);
    }
}