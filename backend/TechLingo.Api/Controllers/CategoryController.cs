using Microsoft.AspNetCore.Mvc;
using TechLingo.Core.Entities;
using TechLingo.Core.Repositories;
using TechLingo.Core.DTOs;
using TechLingo.Core.Services;

namespace TechLingo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly CategoryRepository _repository;
    private readonly QuestionService _questionService;

    public CategoriesController(CategoryRepository repository, QuestionService questionService)
    {
        _repository = repository;
        _questionService = questionService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Category>>> GetAll()
    {
        var categories = await _repository.GetAllAsync();

        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Category>> GetById(string id)
    {
        var category = await _repository.GetByIdAsync(id);

        if (category is null)
            return NotFound();

        return Ok(category);
    }

    [HttpGet("{categoryId}/questions")]
    public async Task<ActionResult<List<QuestionDto>>> GetByCategory(
        string categoryId)
    {
        var questions =
            await _questionService.GetByCategoryAsync(categoryId);

        return Ok(questions);
    }
}