using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechLingo.Core.DTOs;
using TechLingo.Core.Services;

namespace TechLingo.Api.Controllers;

[Authorize]
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

    [HttpPost("question/answer")]
    public async Task<ActionResult<AnswerResultDto>> SubmitQuestion(
        SubmitAnswerDto submitAnswerDto)
    {
        var result =
            await _questionService.ValidateAnswerAsync(submitAnswerDto);

        if (result is null)
        {
            return NotFound(new AnswerResultDto
            {
                IsCorrect = false,
                Points = 0,
                CorrectAnswer = string.Empty,
                CorrectAnswerId = string.Empty,
                ErrorMessage = "Question or answer not found."
            });
        }

        return Ok(result);
    }
}