using MongoDB.Driver;
using TechLingo.Core.Entities;

namespace TechLingo.Core.Repositories;

public class CategoryRepository
{
    private readonly IMongoCollection<Category> _categories;

    public CategoryRepository(IMongoDatabase database)
    {
        _categories =
            database.GetCollection<Category>("categories");
    }

    public async Task<List<Category>> GetAllAsync()
    {
        return await _categories
            .Find(_ => true)
            .ToListAsync();
    }

    public async Task<Category?> GetByIdAsync(string id)
    {
        return await _categories
            .Find(c => c.Id == id)
            .FirstOrDefaultAsync();
    }
}