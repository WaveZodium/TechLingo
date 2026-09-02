using TechLingo.Core.DTOs;
using TechLingo.Core.Entities;
using TechLingo.Core.Enums;
using TechLingo.Core.Interfaces;

namespace TechLingo.Core.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly ITokenService _tokenService;

        public AuthService(IUserRepository userRepository, ITokenService tokenService)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
        }

        public async Task<string> RegisterAsync(RegisterDto request)
        {
            var existingUser = await _userRepository.GetByUsernameAsync(request.Username);
            if (existingUser != null)
                throw new Exception("Användarnamnet används redan.");

            var newUser = new User
            {
                Username = request.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = UserRole.User
            };

            await _userRepository.CreateAsync(newUser);
            return "Användarkonto skapat!";
        }

        public async Task<string> LoginAsync(LoginDto request)
        {
            var user =
                await _userRepository.GetByUsernameAsync(request.Username);

            if (user == null ||
                !BCrypt.Net.BCrypt.Verify(
                    request.Password,
                    user.PasswordHash))
            {
                throw new Exception(
                    "Felaktigt användarnamn eller lösenord.");
            }

            return _tokenService.GenerateToken(user);
        }

    }
}
