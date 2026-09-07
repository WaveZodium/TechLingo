using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechLingo.Core.DTOs;
using TechLingo.Core.DTOs.Admin;
using TechLingo.Core.Enums;
using TechLingo.Core.Interfaces;
using TechLingo.Core.Services;

namespace TechLingo.Api.Controllers;

[Authorize(Roles = nameof(UserRole.Admin))]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase {
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }


    // Users — /api/admin/users
    
    // GET /api/admin/users — hämta alla användare
    [HttpGet("users")]
    public async Task<ActionResult<List<UserDto>>> GetAllUsers()
    {
        var users = await _adminService.GetAllUsersAsync();
        return Ok(users);
    }

    // GET /api/admin/users/{id} — hämta en specifik användare
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

    // POST /api/admin/users — skapa användare
    [HttpPost("users")]
    public async Task<ActionResult<UserDto>> CreateUser(CreateUserDto createUserDto)
    {
        try
        {
            var user = await _adminService.CreateUserAsync(createUserDto);
            return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PUT /api/admin/users/{id} — uppdatera hela användaren
    [HttpPut("users/{id}")]
    public async Task<ActionResult<UserDto>> UpdateUser(string id, UpdateUserDto updateUserDto)
    {
        var user = await _adminService.UpdateUserAsync(id, updateUserDto);
        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    // DELETE /api/admin/users/{id} — ta bort användare
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

    // PATCH /api/admin/users/{id}/password — sätt/byta lösenord från adminpanelen
    [HttpPatch("users/{id}/password")]
    public async Task<ActionResult> ChangeUserPassword(string id, ChangePasswordDto changePasswordDto)
    {
        var success = await _adminService.ChangePasswordAsync(id, changePasswordDto);
        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }



    /* PLANERING

    Users — /api/admin/users
        GET /api/admin/users — hämta alla användare
        GET /api/admin/users/{id} — hämta en specifik användare
        POST /api/admin/users — skapa användare
        PUT /api/admin/users/{id} — uppdatera hela användaren
        - PATCH /api/admin/users/{id} — uppdatera enstaka fält, t.ex. Role
          ...vi skippar patch-metoden
        DELETE /api/admin/users/{id} — ta bort användare
        PATCH /api/admin/users/{id}/password — sätt/byta lösenord från adminpanelen

        Viktigt: skicka aldrig tillbaka PasswordHash i API-svaret. Vid skapande/lösenordsbyte skickar frontend ett vanligt lösenord över HTTPS och backend hashar det.

    Categories — /api/admin/categories
        GET /api/admin/categories — hämta alla kategorier
        GET /api/admin/categories/{id} — hämta kategori
        POST /api/admin/categories — skapa kategori
        PUT /api/admin/categories/{id} — uppdatera kategori
        - PATCH /api/admin/categories/{id} — uppdatera enstaka fält, t.ex. IsActive
          ...vi skippar patch-metoden
        DELETE /api/admin/categories/{id} — ta bort kategori
        
        Med nuvarande fält blir det ungefär Name, Slug, Description, IsActive.

    Questions — /api/admin/questions
        GET /api/admin/questions — hämta alla frågor
        GET /api/admin/questions/{id} — hämta en fråga
        POST /api/admin/questions — skapa fråga
        PUT /api/admin/questions/{id} — uppdatera fråga
        - PATCH /api/admin/questions/{id} — uppdatera enstaka fält, t.ex. IsActive
          ...vi skippar patch-metoden
        DELETE /api/admin/questions/{id} — ta bort fråga

        Huvudsakliga fält här verkar vara CategoryId, Message, Prompt, Options, Explanation och IsActive.
    */
}