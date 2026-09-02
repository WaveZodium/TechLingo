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

    [HttpPost("{id}/answer")]
    public async Task<ActionResult<AnswerResultDto>> SubmitQuestion(string id, [FromBody] string answer)
    {
        // TODO: Implementera ValidateAnswerAsync i service.
        var result = await _questionService.ValidateAnswerAsync(id, answer);

        if (!result.IsSuccess)
            return BadRequest(result.ErrorMessage);

        // TODO: Lägg till mer felhantering här.

        return Ok(result);
    }
}