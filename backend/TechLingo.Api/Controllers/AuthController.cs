using Microsoft.AspNetCore.Mvc;
using TechLingo.Core.DTOs;
using TechLingo.Core.DTOs.Auth;
using TechLingo.Core.Interfaces;

namespace TechLingo.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            try
            {
                var result = await _authService.RegisterAsync(request);
                return Ok(new RegisterResponseDto { Message = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new ErrorResponseDto { ErrorMessage = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            try
            {
                var token = await _authService.LoginAsync(request);
                return Ok(new LoginResponseDto { Token = token });
            }
            catch (Exception ex)
            {
                return Unauthorized(new ErrorResponseDto { ErrorMessage = ex.Message });
            }
        }
    }
}
