using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillExtractionTool.Api.Data;
using SkillExtractionTool.Api.DTOs;
using SkillExtractionTool.Api.Models;
using SkillExtractionTool.Api.Services;

namespace SkillExtractionTool.Api.Controllers;

[ApiController]
[Route("api/extraction")]
public class ExtractionController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IDocumentParsingService _documentParser;
    private readonly ISkillExtractionService _skillExtractor;

    public ExtractionController(
        AppDbContext db,
        IDocumentParsingService documentParser,
        ISkillExtractionService skillExtractor)
    {
        _db = db;
        _documentParser = documentParser;
        _skillExtractor = skillExtractor;
    }

    /// <summary>
    /// Uploads CV and IFU documents and triggers skill extraction.
    /// </summary>
    [HttpPost]
    [Route("/api/extraction")]
    public async Task<ActionResult<ExtractionResponseDto>> Create(
        IFormFile cvFile,
        IFormFile ifuFile)
    {
        if (cvFile is null || ifuFile is null)
            return BadRequest("Both cvFile and ifuFile are required.");

        string cvText;
        string ifuText;

        try
        {
            await using var cvStream = cvFile.OpenReadStream();
            cvText = await _documentParser.ExtractTextAsync(cvStream, cvFile.FileName);

            await using var ifuStream = ifuFile.OpenReadStream();
            ifuText = await _documentParser.ExtractTextAsync(ifuStream, ifuFile.FileName);
        }
        catch (NotSupportedException ex)
        {
            return StatusCode(StatusCodes.Status415UnsupportedMediaType, ex.Message);
        }

        var skills = await _skillExtractor.ExtractSkillsAsync(cvText, ifuText);

        var result = new ExtractionResult
        {
            Id = Guid.NewGuid(),
            Timestamp = DateTime.UtcNow,
            CvFileName = cvFile.FileName,
            IfuFileName = ifuFile.FileName,
            ExtractedSkillsJson = JsonSerializer.Serialize(skills)
        };

        _db.ExtractionResults.Add(result);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = result.Id }, ToDto(result, skills));
    }

    /// <summary>
    /// Returns a single extraction result by ID.
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ExtractionResponseDto>> GetById(Guid id)
    {
        var result = await _db.ExtractionResults.FindAsync(id);

        if (result is null)
            return NotFound();

        var skills = JsonSerializer.Deserialize<ExtractedSkills>(result.ExtractedSkillsJson);
        return Ok(ToDto(result, skills));
    }

    /// <summary>
    /// Returns all extraction results, newest first.
    /// </summary>
    [HttpGet]
    [Route("/api/extractions")]
    public async Task<ActionResult<IEnumerable<ExtractionResponseDto>>> GetAll()
    {
        var results = await _db.ExtractionResults
            .OrderByDescending(r => r.Timestamp)
            .ToListAsync();

        var dtos = results.Select(r =>
        {
            var skills = JsonSerializer.Deserialize<ExtractedSkills>(r.ExtractedSkillsJson);
            return ToDto(r, skills);
        });

        return Ok(dtos);
    }

    /// <summary>
    /// Deletes an extraction result by ID.
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _db.ExtractionResults.FindAsync(id);

        if (result is null)
            return NotFound();

        _db.ExtractionResults.Remove(result);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    private static ExtractionResponseDto ToDto(ExtractionResult result, ExtractedSkills? skills) =>
        new()
        {
            Id = result.Id,
            Timestamp = result.Timestamp,
            CvFileName = result.CvFileName,
            IfuFileName = result.IfuFileName,
            Skills = skills
        };
}
