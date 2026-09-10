using MongoDB.Driver;
using TechLingo.Core.Entities;

namespace TechLingo.Core.Data
{
    public class CategorySeeder
    {
        public async Task<Dictionary<string, string>> SeedAsync(
            IMongoCollection<Category> categories)
        {
            var categoryIds = new Dictionary<string, string>();

            var internetCulture = await categories
                .Find(c => c.Slug == "internet-culture")
                .FirstOrDefaultAsync();

            if (internetCulture is null)
            {
                internetCulture = new Category
                {
                    Name = "Internet Culture",
                    Slug = "internet-culture",
                    Description = "Learn popular internet abbreviations used across social media, chats and memes."
                };

                await categories.InsertOneAsync(internetCulture);
            }

            categoryIds["internet-culture"] = internetCulture.Id;

            var itAbbreviations = await categories
                .Find(c => c.Slug == "it-abbreviations")
                .FirstOrDefaultAsync();

            if (itAbbreviations is null)
            {
                itAbbreviations = new Category
                {
                    Name = "IT Abbreviations",
                    Slug = "it-abbreviations",
                    Description = "Common abbreviations used in IT."
                };

                await categories.InsertOneAsync(itAbbreviations);
            }

            categoryIds["it-abbreviations"] = itAbbreviations.Id;

            return categoryIds;
        }
    }
}
