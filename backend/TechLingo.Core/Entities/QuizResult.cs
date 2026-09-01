using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace TechLingo.Core.Entities
{
    public class QuizResult
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        public string UserId { get; set; } = string.Empty;

        [BsonRepresentation(BsonType.ObjectId)]
        public string CategoryId { get; set; } = null!;

        public int Score { get; set; }

        public int CorrectAnswers { get; set; }

        public int IncorrectAnswers { get; set; }

        public int TotalQuestions { get; set; }

        public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
    }
}
