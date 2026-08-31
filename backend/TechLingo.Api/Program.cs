using MongoDB.Bson;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Required for Swagger to discover API endpoints
builder.Services.AddEndpointsApiExplorer();

// Required for generating Swagger documentation
builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// Build the application instance
var app = builder.Build();





// Health check endpoint for MongoDB
app.MapGet("/health/mongodb", async (IConfiguration configuration) => {
    try {
        var connectionString =
            configuration["MongoDb:ConnectionString"];

        var databaseName =
            configuration["MongoDb:DatabaseName"];

        var client = new MongoClient(connectionString);
        var database = client.GetDatabase(databaseName);

        await database.RunCommandAsync<BsonDocument>(
            new BsonDocument("ping", 1));

        return Results.Ok(new {
            status = "ok",
            database = databaseName
        });
    }
    catch {
        return Results.Problem(
            title: "MongoDB connection failed",
            statusCode: StatusCodes.Status503ServiceUnavailable);
    }
});






// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
     // Enable OpenAPI (Swagger) only in development environment
    app.MapOpenApi();

    // Enable middleware to serve generated Swagger as a JSON endpoint.
    app.UseSwagger();
    
    // Enable middleware to serve Swagger UI (HTML, JS, CSS, etc.)
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors("Frontend");

app.Run();
