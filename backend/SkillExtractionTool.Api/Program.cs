using Microsoft.EntityFrameworkCore;
using SkillExtractionTool.Api.Data;
using SkillExtractionTool.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

builder.Services.AddControllers();

// Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new()
    {
        Title = "Skill Extraction Tool API",
        Version = "v1"
    });
});

// Database — SQLite via EF Core
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Application services
builder.Services.AddScoped<IDocumentParsingService, DocumentParsingService>();
builder.Services.AddScoped<IChatCompletionProvider, OpenAiChatCompletionProvider>();
builder.Services.AddScoped<ISkillExtractionService, SkillExtractionService>();

// CORS — allow the Vite dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("ViteDev", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// ---------------------------------------------------------------------------
// App pipeline
// ---------------------------------------------------------------------------

var app = builder.Build();

// Ensure the SQLite database and schema exist on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// Swagger enabled for all environments (MVP — no production deployment)
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    options.RoutePrefix = "swagger";
});

app.UseCors("ViteDev");

app.MapControllers();

app.Run();

// Required for WebApplicationFactory<Program> in integration tests.
public partial class Program { }
