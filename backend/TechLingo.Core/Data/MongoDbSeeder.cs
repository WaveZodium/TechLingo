using MongoDB.Driver;
using TechLingo.Core.Entities;

namespace TechLingo.Core.Data
{
    public class MongoDbSeeder
    {
        private readonly IMongoDatabase _database;
        private readonly CategorySeeder _categorySeeder;
        private readonly UserSeeder _userSeeder;
        private readonly QuestionSeeder _questionSeeder;

        public MongoDbSeeder(
            IMongoDatabase database,
            CategorySeeder categorySeeder,
            UserSeeder userSeeder,
            QuestionSeeder questionSeeder)
        {
            _database = database;
            _categorySeeder = categorySeeder;
            _userSeeder = userSeeder;
            _questionSeeder = questionSeeder;
        }

        public async Task SeedAsync()
        {
            var categoryIds = await _categorySeeder.SeedAsync(
                _database.GetCollection<Category>("categories"));

            await _userSeeder.SeedAsync(
                _database.GetCollection<User>("users"));

            await _questionSeeder.SeedAsync(
                _database.GetCollection<Question>("questions"),
                categoryIds);
        }
    }
}
