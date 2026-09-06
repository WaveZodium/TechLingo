using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TechLingo.Core.Services;

namespace TechLingo.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
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
