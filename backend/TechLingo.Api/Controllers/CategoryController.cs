using Microsoft.AspNetCore.Mvc;
using TechLingo.Core.Entities;
using TechLingo.Core.Repositories;

namespace TechLingo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly CategoryRepository _repository;

    public CategoriesController(CategoryRepository repository)
    {
        _repository = repository;
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
}