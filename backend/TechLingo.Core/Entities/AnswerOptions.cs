using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Text;

namespace TechLingo.Core.Entities
{
    public class AnswerOption
    {
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        public string Text { get; set; } = string.Empty;
        public bool IsCorrect { get; set; } = false;
    }
}
