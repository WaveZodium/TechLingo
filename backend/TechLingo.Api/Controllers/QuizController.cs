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
public class QuizController : ControllerBase
{
    private readonly QuizService _quizService;

    public QuizController(QuizService quizService)
    {
        _quizService = quizService;
    }

    [HttpPost("start/{categoryId}")]
    public async Task<ActionResult<StartQuizResultDto>> StartQuiz(
        string categoryId)
    {
        var userId = GetUserId();

        if (userId is null)
            return Unauthorized();

        var result = await _quizService.StartQuizAsync(
            userId,
            categoryId
        );

        if (result is null)
            return BadRequest("Could not start quiz.");

        return Ok(result);
    }

    [HttpPost("{sessionId}/answer")]
    public async Task<ActionResult<AnswerResultDto>> SubmitAnswer(
        string sessionId,
        SubmitAnswerDto submitAnswerDto)
    {
        var userId = GetUserId();

        if (userId is null)
            return Unauthorized();

        var result = await _quizService.SubmitAnswerAsync(
            sessionId,
            userId,
            submitAnswerDto
        );

        if (result is null)
            return BadRequest("Could not submit answer.");

        return Ok(result);
    }

    [HttpPost("{sessionId}/complete")]
    public async Task<ActionResult<QuizResultDto>> CompleteQuiz(
        string sessionId)
    {
        var userId = GetUserId();

        if (userId is null)
            return Unauthorized();

        var result = await _quizService.CompleteQuizAsync(
            sessionId,
            userId
        );

        if (result is null)
            return BadRequest("Could not complete quiz.");

        return Ok(result);
    }

    [HttpGet("history")]
    public async Task<ActionResult<List<QuizHistoryDto>>> GetQuizHistory()
    {
        var userId = GetUserId();

        if (userId is null)
            return Unauthorized();

        var history =
            await _quizService.GetQuizHistoryAsync(
                userId,
                5
            );

        return Ok(history);
    }

    [HttpDelete("{sessionId}")]
    public async Task<IActionResult> QuitQuiz(
        string sessionId)
    {
        var userId = GetUserId();

        if (userId is null)
            return Unauthorized();

        var deleted =
            await _quizService.QuitQuizAsync(
                sessionId,
                userId
            );

        if (!deleted)
            return BadRequest("Could not quit quiz.");

        return NoContent();
    }


    private string? GetUserId()
    {
        return
            User.FindFirstValue(ClaimTypes.NameIdentifier) ??
            User.FindFirstValue(JwtRegisteredClaimNames.Sub);
    }
}