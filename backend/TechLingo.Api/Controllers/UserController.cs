using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TechLingo.Core.DTOs;
using TechLingo.Core.Interfaces;
using TechLingo.Core.Services;

namespace TechLingo.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [Authorize]
        [HttpGet("account")]
        public async Task<IActionResult> GetUserById()
        {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            UserProfileDto? user = await _userService.GetUserByIdAsync(userId);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [Authorize]
        [HttpDelete("account")]
        public async Task<IActionResult> DeleteUser()
        {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            bool wasDeleted = await _userService.DeleteUserAsync(userId);

            if (!wasDeleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
