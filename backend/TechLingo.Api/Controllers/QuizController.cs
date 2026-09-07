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

    [HttpPost("complete")]
    public async Task<ActionResult<QuizResultDto>> CompleteQuiz(
        CompleteQuizDto completeQuizDto)
    {
        var userId =
            User.FindFirstValue(ClaimTypes.NameIdentifier) ??
            User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (userId is null)
            return Unauthorized();

        var result = await _quizService.CompleteQuizAsync(
            userId,
            completeQuizDto
        );

        if (result is null)
            return BadRequest("Could not complete quiz.");

        return Ok(result);
    }
}