using Microsoft.OpenApi;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Text;
using TechLingo.Core.Configuration;
using TechLingo.Core.Data;
using TechLingo.Core.Interfaces;
using TechLingo.Core.Repositories;
using TechLingo.Core.Services;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// MongoDB settings
var mongoSettings = builder.Configuration
    .GetSection(MongoDbSettings.SectionName)
    .Get<MongoDbSettings>()
    ?? throw new InvalidOperationException(
        "MongoDb configuration is missing.");

if (string.IsNullOrWhiteSpace(mongoSettings.ConnectionString))
{
    throw new InvalidOperationException(
        "MongoDb:ConnectionString is missing.");
}

if (string.IsNullOrWhiteSpace(mongoSettings.DatabaseName))
{
    throw new InvalidOperationException(
        "MongoDb:DatabaseName is missing.");
}

// Register settings
builder.Services.AddSingleton(mongoSettings);

// One MongoClient for the lifetime of the application
builder.Services.AddSingleton<IMongoClient>(
    _ => new MongoClient(mongoSettings.ConnectionString));

// Register the TechLingo database
builder.Services.AddSingleton<IMongoDatabase>(sp =>
{
    var client = sp.GetRequiredService<IMongoClient>();

    return client.GetDatabase(mongoSettings.DatabaseName);
});

builder.Services.AddScoped<MongoDbSeeder>();

builder.Services.AddScoped<QuestionRepository>();
builder.Services.AddScoped<CategoryRepository>();
builder.Services.AddScoped<QuestionService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAdminService, AdminService>();

// Konfigurera JWT-autentisering
builder.Services.Configure<JwtSettings>(
builder.Configuration.GetSection(JwtSettings.SectionName));

var jwtSettings = builder.Configuration
    .GetSection(JwtSettings.SectionName)
    .Get<JwtSettings>()
    ?? throw new InvalidOperationException("JWT settings saknas.");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings.Key)),

            ValidateIssuer = true,
            ValidIssuer = jwtSettings.Issuer,

            ValidateAudience = true,
            ValidAudience = jwtSettings.Audience,

            ValidateLifetime = true,

            ClockSkew = TimeSpan.Zero
        };
    });

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Required for Swagger to discover API endpoints
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT token."
    });

    options.AddSecurityRequirement(document =>
        new OpenApiSecurityRequirement
        {
            [new OpenApiSecuritySchemeReference("Bearer", document)] = []
        });
});
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


// Seed the database with initial data
using (var scope = app.Services.CreateScope())
{
    var seeder =
        scope.ServiceProvider.GetRequiredService<MongoDbSeeder>();

    await seeder.SeedAsync();
}



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
    catch (Exception ex){
        Console.WriteLine(ex.Message);
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

app.UseCors("Frontend");

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();



app.Run();
