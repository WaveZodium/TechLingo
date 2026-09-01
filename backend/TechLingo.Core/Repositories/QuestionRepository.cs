using MongoDB.Driver;
using TechLingo.Core.Entities;

namespace TechLingo.Core.Repositories;

public class QuestionRepository
{
    private readonly IMongoCollection<Question> _questions;

    //hämta alla frågor
    public QuestionRepository(IMongoDatabase database)
    {
        _questions = database.GetCollection<Question>("questions");
    }
    
    public async Task<List<Question>> GetAllAsync()
    {
        return await _questions
            .Find(_ => true)
            .ToListAsync();
    }

    public async Task<Question?> GetByIdAsync(string id)
    {
        return await _questions
            .Find(q => q.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task<List<Question>> GetByCategoryAsync(string categoryId)
    {
        return await _questions
            .Find(q => q.CategoryId == categoryId)
            .ToListAsync();
    }
}