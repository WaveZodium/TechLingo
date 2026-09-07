using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TechLingo.Core.Entities;

public class QuizSession
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } =
        ObjectId.GenerateNewId().ToString();

    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = string.Empty;

    [BsonRepresentation(BsonType.ObjectId)]
    public string CategoryId { get; set; } = string.Empty;

    public List<string> QuestionIds { get; set; } = [];

    public List<QuizSessionAnswer> Answers { get; set; } = [];

    public int Score { get; set; } = 0;

    public bool IsCompleted { get; set; } = false;

    public DateTime StartedAt { get; set; } = DateTime.UtcNow;

    public DateTime? CompletedAt { get; set; }
}

public class QuizSessionAnswer
{
    public string QuestionId { get; set; } = string.Empty;

    public string AnswerId { get; set; } = string.Empty;

    public bool IsCorrect { get; set; }

    public int Points { get; set; }
}