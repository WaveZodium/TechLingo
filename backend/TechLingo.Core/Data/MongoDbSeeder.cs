using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Text;
using TechLingo.Core.Entities;

namespace TechLingo.Core.Data
{
    public class MongoDbSeeder
    {
        private readonly IMongoDatabase _database;

        public MongoDbSeeder(IMongoDatabase database)
        {
            _database = database;
        }

        public async Task SeedAsync()
        {
            var categories =
                _database.GetCollection<Category>("categories");

            var questions =
                _database.GetCollection<Question>("questions");

            if (await categories.CountDocumentsAsync(_ => true) > 0)
                return;

            var internetSlang = new Category
            {
                Name = "Internet Slang",
                Slug = "internet-slang",
                Description = "Common internet slang and chat abbreviations."
            };

            var itAbbreviations = new Category
            {
                Name = "IT Abbreviations",
                Slug = "it-abbreviations",
                Description = "Common abbreviations used in IT."
            };

            await categories.InsertManyAsync(
            [
                internetSlang,
            itAbbreviations
            ]);

            var brbCorrect = new AnswerOption
            {
                Text = "Be right back"
            };

            var questionsToSeed = new List<Question>
        {
            new()
            {
                CategoryId = internetSlang.Id,

                Message = "BRB, need coffee.",

                Prompt = "What does BRB mean?",

                Options =
                [
                    brbCorrect,
                    new() { Text = "Bring right back" },
                    new() { Text = "Be really busy" },
                    new() { Text = "Back right before" }
                ],

                CorrectAnswerId = brbCorrect.Id,

                Explanation =
                    "BRB means 'Be right back'."
            }
        };

            await questions.InsertManyAsync(questionsToSeed);
        }
    }
}
