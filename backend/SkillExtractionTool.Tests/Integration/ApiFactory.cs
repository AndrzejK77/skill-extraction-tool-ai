using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using OpenAI.Chat;
using SkillExtractionTool.Api.Services;

namespace SkillExtractionTool.Tests.Integration;

/// <summary>
/// Custom WebApplicationFactory that:
/// - Replaces the SQLite database with an EF Core in-memory database per test run.
/// - Replaces IChatCompletionProvider with a no-op stub (no real OpenAI calls).
/// - Supplies a dummy OpenAI:ApiKey so OpenAiChatCompletionProvider constructor never runs.
/// </summary>
public class ApiFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // ----------------------------------------------------------------
            // Replace SQLite AppDbContext with an isolated in-memory database.
            // ----------------------------------------------------------------
            var dbDescriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<SkillExtractionTool.Api.Data.AppDbContext>));
            if (dbDescriptor is not null)
                services.Remove(dbDescriptor);

            services.AddDbContext<SkillExtractionTool.Api.Data.AppDbContext>(options =>
                options.UseInMemoryDatabase("IntegrationTestDb_" + Guid.NewGuid()));

            // ----------------------------------------------------------------
            // Replace IChatCompletionProvider with a stub — no real LLM calls.
            // ----------------------------------------------------------------
            var chatDescriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(IChatCompletionProvider));
            if (chatDescriptor is not null)
                services.Remove(chatDescriptor);

            var stubProvider = new Mock<IChatCompletionProvider>();
            stubProvider
                .Setup(p => p.CompleteAsync(It.IsAny<IEnumerable<ChatMessage>>()))
                .ReturnsAsync("""
                    {
                      "technicalSkills": ["C#"],
                      "softSkills": [],
                      "tools": [],
                      "experienceAreas": []
                    }
                    """);
            services.AddScoped<IChatCompletionProvider>(_ => stubProvider.Object);
        });
    }
}
