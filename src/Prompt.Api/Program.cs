using Microsoft.EntityFrameworkCore;
using Prompt.Infrastructure;
using Prompt.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure database
var userFolder = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
var dbPath = Path.Combine(userFolder, ".prompt", "skills.db");
Directory.CreateDirectory(Path.GetDirectoryName(dbPath)!);
var connectionString = $"Data Source={dbPath}";

builder.Services.AddInfrastructure(connectionString);

var app = builder.Build();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<PromptDbContext>();
    context.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
