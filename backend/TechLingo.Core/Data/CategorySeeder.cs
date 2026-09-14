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

            // Seed Internet Culture category
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

            // Seed IT Abbreviations category
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

            // Seed Cybersecurity Basics category
            var cybersecurityBasics = await categories
                .Find(c => c.Slug == "cybersecurity-basics")
                .FirstOrDefaultAsync();

            if (cybersecurityBasics is null)
            {
                cybersecurityBasics = new Category
                {
                    Name = "Cybersecurity Basics",
                    Slug = "cybersecurity-basics",
                    Description = "Learn common cybersecurity concepts, threats and protective measures."
                };

                await categories.InsertOneAsync(cybersecurityBasics);
            }

            categoryIds["cybersecurity-basics"] = cybersecurityBasics.Id;

            // Seed Programming Languages category
            var programmingLanguages = await categories
                .Find(c => c.Slug == "programming-languages")
                .FirstOrDefaultAsync();

            if (programmingLanguages is null)
            {
                programmingLanguages = new Category
                {
                    Name = "Programming Languages",
                    Slug = "programming-languages",
                    Description = "Learn popular programming languages and their syntax."
                };

                await categories.InsertOneAsync(programmingLanguages);
            }

            categoryIds["programming-languages"] = programmingLanguages.Id;

            return categoryIds;
        }
    }
}
