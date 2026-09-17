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
    // hanterar CRUD-operationer för quizsessioner i databasen
    public async Task CreateAsync(QuizSession quizSession)
    {
        await _quizSessions.InsertOneAsync(quizSession);
    }
    // hämtar en quizsession baserat på dess ID
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
        // skapar filter för att hitta den quizsession som ska uppdateras med det nya svaret
        var filter = Builders<QuizSession>.Filter.And(
            Builders<QuizSession>.Filter.Eq(
                session => session.Id,
                sessionId
            ),

            Builders<QuizSession>.Filter.Eq(
                session => session.IsCompleted,
                false
            ),
            // säkerställer att quizsessionen inte redan är avslutad innan ett svar läggs till
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
        // utför uppdateringen av quizsessionen med det angivna filtret och uppdateringsdefinitionen
        var result = await _quizSessions.UpdateOneAsync(
            filter,
            update
        );

        return result.ModifiedCount == 1;
    }
    // markerar en quizsession som avslutad och returnerar den uppdaterade sessionen
    public async Task<QuizSession?> CompleteAsync(
        string sessionId)
    {
        // skapar filter för att hitta den quizsession som ska markeras som avslutad
        var filter = Builders<QuizSession>.Filter.And(
            Builders<QuizSession>.Filter.Eq(
                session => session.Id,
                sessionId
            ),
            Builders<QuizSession>.Filter.Eq(
                session => session.IsCompleted,
                false
            )
        );

        // skapar uppdateringsdefinitionen för att markera quizsessionen som avslutad och sätta avslutningstid
        var update = Builders<QuizSession>.Update
            .Set(
                session => session.IsCompleted,
                true
            )
            .Set(
                session => session.CompletedAt,
                DateTime.UtcNow
            );

        // skapar alternativ för att returnera den uppdaterade quizsessionen efter uppdateringen
        var options =
            new FindOneAndUpdateOptions<QuizSession>
            {
                ReturnDocument = ReturnDocument.After // returnerar den uppdaterade quizsessionen efter uppdateringen
            };

        return await _quizSessions.FindOneAndUpdateAsync(
            filter,
            update,
            options
        );
    }
    public async Task<bool> DeleteAsync(string sessionId)
    {
        var result = await _quizSessions.DeleteOneAsync(
            session => session.Id == sessionId
        );

        return result.DeletedCount == 1;
    }

    // hämtar de senaste avslutade quizsessionerna för en specifik användare
    public async Task<List<QuizSession>> GetLatestCompletedByUserAsync(
        string userId,
        int count)
    {
        return await _quizSessions
            .Find(session =>
                session.UserId == userId &&
                session.IsCompleted)
            .SortByDescending(session => session.CompletedAt)
            .Limit(count)
            .ToListAsync();
    }
    public async Task CreateIndexesAsync()
    {
        var indexKeys = Builders<QuizSession>
            .IndexKeys
            .Ascending(session => session.StartedAt);

        var options = new CreateIndexOptions<QuizSession>
        {
            Name = "unfinished_quiz_session_ttl",
            ExpireAfter = TimeSpan.FromHours(2),

            PartialFilterExpression =
                Builders<QuizSession>.Filter.Eq(
                    session => session.IsCompleted,
                    false
                )
        };

        var indexModel =
            new CreateIndexModel<QuizSession>(
                indexKeys,
                options
            );

        await _quizSessions.Indexes.CreateOneAsync(
            indexModel
        );
    }

    public async Task<QuizSession?> GetActiveSessionAsync(
        string userId,
        string categoryId)
    {
        return await _quizSessions
            .Find(session =>
                session.UserId == userId &&
                session.CategoryId == categoryId &&
                !session.IsCompleted)
            .SortByDescending(session => session.StartedAt)
            .FirstOrDefaultAsync();
    }
}