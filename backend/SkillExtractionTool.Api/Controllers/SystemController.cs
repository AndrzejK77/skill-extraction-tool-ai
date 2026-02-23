using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillExtractionTool.Api.Data;
using SkillExtractionTool.Api.DTOs;

namespace SkillExtractionTool.Api.Controllers;

[ApiController]
[Route("api/system")]
public class SystemController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _configuration;

    public SystemController(AppDbContext db, IConfiguration configuration)
    {
        _db = db;
        _configuration = configuration;
    }

    /// <summary>
    /// Returns the current system health status.
    /// Does not call the LLM — only checks that the API key is configured.
    /// </summary>
    [HttpGet("status")]
    public async Task<ActionResult<SystemStatusDto>> GetStatus()
    {
        bool dbConnected;

        try
        {
            dbConnected = await _db.Database.CanConnectAsync();
        }
        catch
        {
            dbConnected = false;
        }

        var apiKey = _configuration["OpenAI:ApiKey"];
        var llmConfigured = !string.IsNullOrWhiteSpace(apiKey);

        return Ok(new SystemStatusDto
        {
            ApiStatus = "ok",
            DatabaseConnected = dbConnected,
            LlmConfigured = llmConfigured,
            Timestamp = DateTime.UtcNow
        });
    }
}
