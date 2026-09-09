using TechLingo.Core.DTOs.Admin;
using TechLingo.Core.Entities;
using TechLingo.Core.Interfaces;
using TechLingo.Core.Repositories;

namespace TechLingo.Core.Services
{
    public class AdminService : IAdminService
    {
        private readonly IUserRepository _userRepository;
        private readonly CategoryRepository _categoryRepository;
        private readonly QuestionRepository _questionRepository;

        public AdminService(
            IUserRepository userRepository,
            CategoryRepository categoryRepository,
            QuestionRepository questionRepository)
        {
            _userRepository = userRepository;
            _categoryRepository = categoryRepository;
            _questionRepository = questionRepository;
        }


        // Users
        // Här hämtas alla användare
        public async Task<List<UserDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();

            return users.Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Role = u.Role
            }).ToList();
        }

        // Här hämtas en användare baserat på ID
        public async Task<UserDto?> GetUserByIdAsync(string id)
        {
            var user = await _userRepository.GetByIdAsync(id);

            if (user == null)
            {
                return null;
            }

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role
            };
        }

        // Här skapas en ny användare
        public async Task<UserDto> CreateUserAsync(CreateUserDto createUserDto)
        {
            var existingUser =
                await _userRepository.GetByUsernameAsync(createUserDto.Username);

            if (existingUser != null)
            {
                throw new InvalidOperationException("Användarnamnet upptaget.");
            }

            var user = new User
            {
                Username = createUserDto.Username,
                PasswordHash =
                    BCrypt.Net.BCrypt.HashPassword(createUserDto.Password),
                Role = createUserDto.Role
            };

            await _userRepository.CreateAsync(user);

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role
            };
        }

        // Här uppdateras användarens information
        public async Task<UserDto?> UpdateUserAsync(
            string id,
            UpdateUserDto updateUserDto)
        {
            var user = await _userRepository.GetByIdAsync(id);

            if (user == null)
            {
                return null;
            }

            user.Username = updateUserDto.Username;
            user.Role = updateUserDto.Role;

            await _userRepository.UpdateAsync(user);

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role
            };
        }

        // Här tas en användare bort
        public async Task<bool> DeleteUserAsync(string id)
        {
            var user = await _userRepository.GetByIdAsync(id);

            if (user == null)
            {
                return false;
            }

            await _userRepository.DeleteAsync(id);

            return true;
        }

        // Här ändras användarens lösenord
        public async Task<bool> ChangePasswordAsync(
            string id,
            ChangePasswordDto changePasswordDto)
        {
            var user = await _userRepository.GetByIdAsync(id);

            if (user == null)
            {
                return false;
            }

            user.PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);

            await _userRepository.UpdateAsync(user);

            return true;
        }


        // Categories
        // Här hämtas alla kategorier
        public async Task<List<AdminCategoryDto>> GetAllCategoriesAsync()
        {
            var categories = await _categoryRepository.GetAllAsync();

            return categories.Select(c => MapCategoryToDto(c)).ToList();
        }

        // Här hämtas en kategori baserat på ID
        public async Task<AdminCategoryDto?> GetCategoryByIdAsync(string id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);

            if (category == null)
            {
                return null;
            }

            return MapCategoryToDto(category);
        }

        // Här skapas en ny kategori baserat på DTO:n (CreateCategoryDto)
        public async Task<AdminCategoryDto> CreateCategoryAsync(
            CreateCategoryDto createCategoryDto)
        {
            var category = new Category
            {
                Name = createCategoryDto.Name,
                Slug = createCategoryDto.Slug,
                Description = createCategoryDto.Description,
                IsActive = createCategoryDto.IsActive
            };

            await _categoryRepository.CreateAsync(category);

            return MapCategoryToDto(category);
        }

        // Här uppdateras kategorin baserat på DTO:n (UpdateCategoryDto)
        public async Task<AdminCategoryDto?> UpdateCategoryAsync(
            string id,
            UpdateCategoryDto updateCategoryDto)
        {
            var category = await _categoryRepository.GetByIdAsync(id);

            if (category == null)
            {
                return null;
            }

            category.Name = updateCategoryDto.Name;
            category.Slug = updateCategoryDto.Slug;
            category.Description = updateCategoryDto.Description;
            category.IsActive = updateCategoryDto.IsActive;

            await _categoryRepository.UpdateAsync(category);

            return MapCategoryToDto(category);
        }

        // Här tas en kategori bort baserat på ID
        public async Task<bool> DeleteCategoryAsync(string id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);

            if (category == null)
            {
                return false;
            }

            var questions =
                await _questionRepository.GetByCategoryAsync(id);

            if (questions.Count > 0)
            {
                throw new InvalidOperationException(
                    "Kategorin kan inte tas bort eftersom den innehåller frågor.");
            }

            await _categoryRepository.DeleteAsync(id);

            return true;
        }


        // Questions
        // Här hämtas alla frågor
        public async Task<List<AdminQuestionDto>> GetAllQuestionsAsync()
        {
            var questions = await _questionRepository.GetAllAsync();

            return questions.Select(q => MapQuestionToDto(q)).ToList();
        }

        // Här hämtas en fråga baserat på ID
        public async Task<AdminQuestionDto?> GetQuestionByIdAsync(string id)
        {
            var question = await _questionRepository.GetByIdAsync(id);

            if (question == null)
            {
                return null;
            }

            return MapQuestionToDto(question);
        }

        // Här skapas en ny fråga baserat på DTO:n (CreateQuestionDto)
        public async Task<AdminQuestionDto> CreateQuestionAsync(
            CreateQuestionDto createQuestionDto)
        {
            var category =
                await _categoryRepository.GetByIdAsync(
                    createQuestionDto.CategoryId);

            if (category == null)
            {
                throw new InvalidOperationException(
                    "Kategorin finns inte.");
            }

            // här skapas en ny fråga baserat på DTO:n
            var question = new Question
            {
                CategoryId = createQuestionDto.CategoryId,
                Message = createQuestionDto.Message,
                Prompt = createQuestionDto.Prompt,
                Options = createQuestionDto.Options
                    .Select(MapAnswerOptionFromDto)
                    .ToList(),
                Explanation = createQuestionDto.Explanation,
                IsActive = createQuestionDto.IsActive
            };

            await _questionRepository.CreateAsync(question);

            return MapQuestionToDto(question);
        }

        // Här uppdateras en fråga baserat på DTO:n (UpdateQuestionDto)
        public async Task<AdminQuestionDto?> UpdateQuestionAsync(
            string id,
            UpdateQuestionDto updateQuestionDto)
        {
            var question = await _questionRepository.GetByIdAsync(id);

            if (question == null)
            {
                return null;
            }

            // här uppdateras frågan baserat på DTO:n
            var category =
                await _categoryRepository.GetByIdAsync(
                    updateQuestionDto.CategoryId);

            if (category == null)
            {
                throw new InvalidOperationException(
                    "Kategorin finns inte.");
            }

            question.CategoryId = updateQuestionDto.CategoryId;
            question.Message = updateQuestionDto.Message;
            question.Prompt = updateQuestionDto.Prompt;
            question.Options = updateQuestionDto.Options
                .Select(MapAnswerOptionFromDto)
                .ToList();
            question.Explanation = updateQuestionDto.Explanation;
            question.IsActive = updateQuestionDto.IsActive;

            await _questionRepository.UpdateAsync(question);

            return MapQuestionToDto(question);
        }

        // Här tas en fråga bort baserat på ID
        public async Task<bool> DeleteQuestionAsync(string id)
        {
            var question = await _questionRepository.GetByIdAsync(id);

            if (question == null)
            {
                return false;
            }

            await _questionRepository.DeleteAsync(id);

            return true;
        }


        // Mapping
        // Här mappas kategorier och frågor till deras respektive DTO:er
        private static AdminCategoryDto MapCategoryToDto(Category category)
        {
            return new AdminCategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Slug = category.Slug,
                Description = category.Description,
                IsActive = category.IsActive,
                CreatedAt = category.CreatedAt
            };
        }

        // Här mappas svarsalternativ från DTO till entitet
        private static AdminQuestionDto MapQuestionToDto(Question question)
        {
            return new AdminQuestionDto
            {
                Id = question.Id,
                CategoryId = question.CategoryId,
                Message = question.Message,
                Prompt = question.Prompt,
                Options = question.Options.Select(o =>
                    new AdminAnswerOptionDto
                    {
                        Id = o.Id,
                        Text = o.Text,
                        IsCorrect = o.IsCorrect
                    }).ToList(),
                Explanation = question.Explanation,
                IsActive = question.IsActive,
                CreatedAt = question.CreatedAt
            };
        }

        // Här mappas svarsalternativ från DTO till entitet
        private static AnswerOption MapAnswerOptionFromDto(
            AdminAnswerOptionDto answerOptionDto)
        {
            var answerOption = new AnswerOption
            {
                Text = answerOptionDto.Text,
                IsCorrect = answerOptionDto.IsCorrect
            };

            if (!string.IsNullOrWhiteSpace(answerOptionDto.Id))
            {
                answerOption.Id = answerOptionDto.Id;
            }

            return answerOption;
        }
    }
}