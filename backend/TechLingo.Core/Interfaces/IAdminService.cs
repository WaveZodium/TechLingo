using TechLingo.Core.DTOs.Admin;

namespace TechLingo.Core.Interfaces
{
    public interface IAdminService
    {
        // Users
        Task<List<UserDto>> GetAllUsersAsync();
        Task<UserDto?> GetUserByIdAsync(string id);
        Task<UserDto> CreateUserAsync(CreateUserDto createUserDto);
        Task<UserDto?> UpdateUserAsync(string id,UpdateUserDto updateUserDto);
        Task<bool> DeleteUserAsync(string id);
        Task<bool> ChangePasswordAsync(string id,ChangePasswordDto changePasswordDto);

        // Categories
        Task<List<AdminCategoryDto>> GetAllCategoriesAsync();
        Task<AdminCategoryDto?> GetCategoryByIdAsync(string id);
        Task<AdminCategoryDto> CreateCategoryAsync(CreateCategoryDto createCategoryDto);
        Task<AdminCategoryDto?> UpdateCategoryAsync(string id,UpdateCategoryDto updateCategoryDto);
        Task<bool> DeleteCategoryAsync(string id);

        // Questions
        Task<List<AdminQuestionDto>> GetAllQuestionsAsync();
        Task<AdminQuestionDto?> GetQuestionByIdAsync(string id);
        Task<AdminQuestionDto> CreateQuestionAsync(CreateQuestionDto createQuestionDto);
        Task<AdminQuestionDto?> UpdateQuestionAsync(string id,UpdateQuestionDto updateQuestionDto);
        Task<bool> DeleteQuestionAsync(string id);
    }
}