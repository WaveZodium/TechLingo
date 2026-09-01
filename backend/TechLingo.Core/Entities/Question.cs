using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace TechLingo.Core.Entities
{
    public class Question
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonRepresentation(BsonType.ObjectId)]
        public string CategoryId { get; set; } = null!;

        public string Message { get; set; } = string.Empty;

        public string Prompt { get; set; } = string.Empty;

        public List<AnswerOption> Options { get; set; } = [];

        public string CorrectAnswerId { get; set; } = string.Empty;

        public string? Explanation { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
