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
    private readonly CategoryService _categoryService;
    private readonly QuestionService _questionService;

    public CategoriesController(CategoryService categoryService, QuestionService questionService)
    {
        _categoryService = categoryService;
        _questionService = questionService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Category>>> GetAll()
    {
        var categories = await _categoryService.GetActiveAsync();

        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Category>> GetById(string id)
    {
        var category = await _categoryService.GetActiveByIdAsync(id);

        if (category is null)
            return NotFound();

        return Ok(category);
    }

    [HttpGet("{categoryId}/questions")]
    public async Task<ActionResult<List<QuestionDto>>> GetByCategory(
        string categoryId)
    {
        var category =
            await _categoryService.GetActiveByIdAsync(categoryId);

        if (category is null)
        {
            return NotFound();
        }

        var questions =
            await _questionService.GetByCategoryAsync(categoryId);

        return Ok(questions);
    }
}