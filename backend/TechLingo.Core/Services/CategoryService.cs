using TechLingo.Core.Entities;
using TechLingo.Core.Repositories;

namespace TechLingo.Core.Services;

public class CategoryService
{
    private readonly CategoryRepository _categoryRepository;

    public CategoryService(CategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<List<Category>> GetActiveAsync()
    {
        return await _categoryRepository.GetActiveAsync();
    }

    public async Task<Category?> GetActiveByIdAsync(string id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);

        if (category is null || !category.IsActive)
        {
            return null;
        }

        return category;
    }

    public async Task<bool> IsActiveAsync(string id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);

        return category is not null && category.IsActive;
    }
}