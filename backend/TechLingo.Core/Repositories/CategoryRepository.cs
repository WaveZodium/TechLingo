using MongoDB.Driver;
using TechLingo.Core.Entities;

namespace TechLingo.Core.Repositories;

public class CategoryRepository
{   
    //injicerar MongoDB-kollektionen för kategorier
    private readonly IMongoCollection<Category> _categories;

    //konstruktorn tar emot en MongoDB-databas och hämtar kollektionen för kategorier
    public CategoryRepository(IMongoDatabase database)
    {
        _categories =
            database.GetCollection<Category>("categories");
    }

    //hämtar alla kategorier från databasen
    public async Task<List<Category>> GetAllAsync()
    {
        return await _categories
            .Find(_ => true)
            .ToListAsync();
    }

    //hämtar en kategori baserat på dess id
    public async Task<Category?> GetByIdAsync(string id)
    {
        return await _categories
            .Find(c => c.Id == id)
            .FirstOrDefaultAsync();
    }

    //skapar en ny kategori i databasen
    public async Task CreateAsync(Category category)
    {
        await _categories.InsertOneAsync(category);
    }

    //uppdaterar en befintlig kategori i databasen
    public async Task UpdateAsync(Category category)
    {
        await _categories.ReplaceOneAsync(
            c => c.Id == category.Id,
            category
        );
    }

    //tar bort en kategori från databasen baserat på dess id
    public async Task DeleteAsync(string id)
    {
        await _categories.DeleteOneAsync(c => c.Id == id);
    }
}