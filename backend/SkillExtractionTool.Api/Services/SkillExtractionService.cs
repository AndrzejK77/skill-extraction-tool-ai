using SkillExtractionTool.Api.Models;

namespace SkillExtractionTool.Api.Services;

/// <summary>
/// Stub implementation — real LLM call (OpenAI) not yet implemented.
/// </summary>
public class SkillExtractionService : ISkillExtractionService
{
    public Task<ExtractedSkills> ExtractSkillsAsync(string cvText, string ifuText)
    {
        // TODO: Build strict JSON-only prompt, call OpenAI Chat Completions API,
        // deserialize response into ExtractedSkills. Throw on malformed JSON (502).
        var stub = new ExtractedSkills
        {
            TechnicalSkills = ["[STUB] C#", "[STUB] .NET"],
            SoftSkills = ["[STUB] Communication"],
            Tools = ["[STUB] Git"],
            ExperienceAreas = ["[STUB] Web Development"]
        };

        return Task.FromResult(stub);
    }
}
