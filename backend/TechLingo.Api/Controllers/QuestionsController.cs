using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
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
        var userId =
            User.FindFirstValue(ClaimTypes.NameIdentifier) ??
            User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (userId is null)
            return Unauthorized();

        var result = await _questionService.ValidateAnswerAsync(
            submitAnswerDto,
            userId);

        if (result is null)
        {
            return NotFound(new AnswerResultDto
            {
                IsCorrect = false,
                Points = 0,
                TotalScore = 0,
                CorrectAnswer = string.Empty,
                CorrectAnswerId = string.Empty,
                ErrorMessage = "Question, answer or user not found."
            });
        }

        return Ok(result);
    }
}