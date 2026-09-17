using MongoDB.Driver;
using TechLingo.Core.Entities;

namespace TechLingo.Core.Repositories;

public class QuestionRepository
{
    // Injicerar MongoDB-kollektionen för frågor
    private readonly IMongoCollection<Question> _questions;

    // Konstruktorn tar emot en MongoDB-databas
    // och hämtar kollektionen för frågor
    public QuestionRepository(IMongoDatabase database)
    {
        _questions =
            database.GetCollection<Question>("questions");
    }

    // Hämtar alla frågor från databasen
    public async Task<List<Question>> GetAllAsync()
    {
        return await _questions
            .Find(_ => true)
            .ToListAsync();
    }

    // Hämtar en fråga baserat på dess id
    public async Task<Question?> GetByIdAsync(string id)
    {
        return await _questions
            .Find(q => q.Id == id)
            .FirstOrDefaultAsync();
    }

    // Hämtar alla frågor som tillhör en viss kategori
    public async Task<List<Question>> GetByCategoryAsync(
        string categoryId)
    {
        return await _questions
            .Find(q => q.CategoryId == categoryId)
            .ToListAsync();
    }

    // Hämtar ett slumpmässigt urval av frågor
    // från en viss kategori
    public async Task<List<Question>> GetRandomByCategoryAsync(
        string categoryId,
        int count)
    {
        var questions = await _questions
            .Find(q => q.CategoryId == categoryId)
            .ToListAsync();

        return questions
            .OrderBy(_ => Guid.NewGuid())
            .Take(count)
            .ToList();
    }

    // Skapar en ny fråga i databasen
    public async Task CreateAsync(Question question)
    {
        await _questions.InsertOneAsync(question);
    }

    // Uppdaterar en befintlig fråga i databasen
    public async Task UpdateAsync(Question question)
    {
        await _questions.ReplaceOneAsync(
            q => q.Id == question.Id,
            question
        );
    }

    // Tar bort en fråga från databasen baserat på dess id
    public async Task DeleteAsync(string id)
    {
        await _questions.DeleteOneAsync(
            q => q.Id == id
        );
    }

    // Tar bort alla frågor som tillhör en viss kategori
    public async Task DeleteByCategoryAsync(
        string categoryId)
    {
        await _questions.DeleteManyAsync(
            question =>
                question.CategoryId == categoryId
        );
    }
}