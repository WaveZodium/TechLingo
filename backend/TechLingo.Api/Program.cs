var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Required for Swagger to discover API endpoints
builder.Services.AddEndpointsApiExplorer();

// Required for generating Swagger documentation
builder.Services.AddSwaggerGen();

// Build the application instance
var app = builder.Build();

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

app.Run();
