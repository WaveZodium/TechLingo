using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechLingo.Core.DTOs.Admin;
using TechLingo.Core.Enums;
using TechLingo.Core.Interfaces;

namespace TechLingo.Api.Controllers;

[Authorize(Roles = nameof(UserRole.Admin))]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }


    // Users — /api/admin/users

    // GET /api/admin/users
    [HttpGet("users")]
    public async Task<ActionResult<List<UserDto>>> GetAllUsers()
    {
        var users = await _adminService.GetAllUsersAsync();

        return Ok(users);
    }

    // GET /api/admin/users/{id}
    [HttpGet("users/{id}")]
    public async Task<ActionResult<UserDto>> GetUserById(string id)
    {
        var user = await _adminService.GetUserByIdAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    // POST /api/admin/users
    [HttpPost("users")]
    public async Task<ActionResult<UserDto>> CreateUser(
        CreateUserDto createUserDto)
    {
        try
        {
            var user = await _adminService.CreateUserAsync(createUserDto);

            return CreatedAtAction(
                nameof(GetUserById),
                new { id = user.Id },
                user
            );
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PUT /api/admin/users/{id}
    [HttpPut("users/{id}")]
    public async Task<ActionResult<UserDto>> UpdateUser(
        string id,
        UpdateUserDto updateUserDto)
    {
        var user = await _adminService.UpdateUserAsync(
            id,
            updateUserDto
        );

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    // DELETE /api/admin/users/{id}
    [HttpDelete("users/{id}")]
    public async Task<ActionResult> DeleteUser(string id)
    {
        var success = await _adminService.DeleteUserAsync(id);

        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }

    // PATCH /api/admin/users/{id}/password
    [HttpPatch("users/{id}/password")]
    public async Task<ActionResult> ChangeUserPassword(
        string id,
        ChangePasswordDto changePasswordDto)
    {
        var success = await _adminService.ChangePasswordAsync(
            id,
            changePasswordDto
        );

        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }


    // Categories — /api/admin/categories

    // GET /api/admin/categories
    [HttpGet("categories")]
    public async Task<ActionResult<List<AdminCategoryDto>>> GetAllCategories()
    {
        var categories = await _adminService.GetAllCategoriesAsync();

        return Ok(categories);
    }

    // GET /api/admin/categories/{id}
    [HttpGet("categories/{id}")]
    public async Task<ActionResult<AdminCategoryDto>> GetCategoryById(
        string id)
    {
        var category = await _adminService.GetCategoryByIdAsync(id);

        if (category == null)
        {
            return NotFound();
        }

        return Ok(category);
    }

    // POST /api/admin/categories
    [HttpPost("categories")]
    public async Task<ActionResult<AdminCategoryDto>> CreateCategory(
        CreateCategoryDto createCategoryDto)
    {
        var category = await _adminService.CreateCategoryAsync(
            createCategoryDto
        );

        return CreatedAtAction(
            nameof(GetCategoryById),
            new { id = category.Id },
            category
        );
    }

    // PUT /api/admin/categories/{id}
    [HttpPut("categories/{id}")]
    public async Task<ActionResult<AdminCategoryDto>> UpdateCategory(
        string id,
        UpdateCategoryDto updateCategoryDto)
    {
        var category = await _adminService.UpdateCategoryAsync(
            id,
            updateCategoryDto
        );

        if (category == null)
        {
            return NotFound();
        }

        return Ok(category);
    }

    // DELETE /api/admin/categories/{id}
    [HttpDelete("categories/{id}")]
    public async Task<ActionResult> DeleteCategory(string id)
    {
        try
        {
            var success = await _adminService.DeleteCategoryAsync(id);

            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }


    // Questions — /api/admin/questions

    // GET /api/admin/questions
    [HttpGet("questions")]
    public async Task<ActionResult<List<AdminQuestionDto>>> GetAllQuestions()
    {
        var questions = await _adminService.GetAllQuestionsAsync();

        return Ok(questions);
    }

    // GET /api/admin/questions/{id}
    [HttpGet("questions/{id}")]
    public async Task<ActionResult<AdminQuestionDto>> GetQuestionById(
        string id)
    {
        var question = await _adminService.GetQuestionByIdAsync(id);

        if (question == null)
        {
            return NotFound();
        }

        return Ok(question);
    }

    // POST /api/admin/questions
    [HttpPost("questions")]
    public async Task<ActionResult<AdminQuestionDto>> CreateQuestion(
        CreateQuestionDto createQuestionDto)
    {
        try
        {
            var question = await _adminService.CreateQuestionAsync(
                createQuestionDto
            );

            return CreatedAtAction(
                nameof(GetQuestionById),
                new { id = question.Id },
                question
            );
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PUT /api/admin/questions/{id}
    [HttpPut("questions/{id}")]
    public async Task<ActionResult<AdminQuestionDto>> UpdateQuestion(
        string id,
        UpdateQuestionDto updateQuestionDto)
    {
        try
        {
            var question = await _adminService.UpdateQuestionAsync(
                id,
                updateQuestionDto
            );

            if (question == null)
            {
                return NotFound();
            }

            return Ok(question);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // DELETE /api/admin/questions/{id}
    [HttpDelete("questions/{id}")]
    public async Task<ActionResult> DeleteQuestion(string id)
    {
        var success = await _adminService.DeleteQuestionAsync(id);

        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }
}