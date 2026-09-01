using Microsoft.AspNetCore.Mvc;
using TechLingo.Core.DTOs;
using TechLingo.Core.Services;

namespace TechLingo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuestionsController : ControllerBase
{
    private readonly QuestionService _questionService;

    public QuestionsController(QuestionService questionService)
    {
        _questionService = questionService;
    }

    [HttpGet]
    public async Task<ActionResult<List<QuestionDto>>> GetAll()
    {
        var questions = await _questionService.GetAllAsync();

        return Ok(questions);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<QuestionDto>> GetById(string id)
    {
        var question = await _questionService.GetByIdAsync(id);

        if (question is null)
            return NotFound();

        return Ok(question);
    }

    [HttpGet("category/{categoryId}")]
    public async Task<ActionResult<List<QuestionDto>>> GetByCategory(
        string categoryId)
    {
        var questions =
            await _questionService.GetByCategoryAsync(categoryId);

        return Ok(questions);
    }
}