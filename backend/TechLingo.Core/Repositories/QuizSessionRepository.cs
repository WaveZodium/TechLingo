using MongoDB.Driver;
using TechLingo.Core.Entities;

namespace TechLingo.Core.Repositories;

public class QuizSessionRepository
{
    private readonly IMongoCollection<QuizSession> _quizSessions;

    public QuizSessionRepository(IMongoDatabase database)
    {
        _quizSessions =
            database.GetCollection<QuizSession>("quizSessions");
    }

    public async Task CreateAsync(QuizSession quizSession)
    {
        await _quizSessions.InsertOneAsync(quizSession);
    }

    public async Task<QuizSession?> GetByIdAsync(string id)
    {
        return await _quizSessions
            .Find(session => session.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task<bool> AddAnswerAsync(
        string sessionId,
        QuizSessionAnswer answer)
    {
        var filter = Builders<QuizSession>.Filter.And(
            Builders<QuizSession>.Filter.Eq(
                session => session.Id,
                sessionId
            ),
            Builders<QuizSession>.Filter.Eq(
                session => session.IsCompleted,
                false
            ),
            Builders<QuizSession>.Filter.Not(
                Builders<QuizSession>.Filter.ElemMatch(
                    session => session.Answers,
                    savedAnswer =>
                        savedAnswer.QuestionId == answer.QuestionId
                )
            )
        );

        var update = Builders<QuizSession>.Update
            .Push(
                session => session.Answers,
                answer
            )
            .Inc(
                session => session.Score,
                answer.Points
            );

        var result = await _quizSessions.UpdateOneAsync(
            filter,
            update
        );

        return result.ModifiedCount == 1;
    }

    public async Task<QuizSession?> CompleteAsync(
        string sessionId)
    {
        var filter = Builders<QuizSession>.Filter.And(
            Builders<QuizSession>.Filter.Eq(
                session => session.Id,
                sessionId
            ),
            Builders<QuizSession>.Filter.Eq(
                session => session.IsCompleted,
                false
            ),
            Builders<QuizSession>.Filter.Size(
                session => session.Answers,
                10
            )
        );

        var update = Builders<QuizSession>.Update
            .Set(
                session => session.IsCompleted,
                true
            )
            .Set(
                session => session.CompletedAt,
                DateTime.UtcNow
            );

        var options =
            new FindOneAndUpdateOptions<QuizSession>
            {
                ReturnDocument = ReturnDocument.After
            };

        return await _quizSessions.FindOneAndUpdateAsync(
            filter,
            update,
            options
        );
    }
}