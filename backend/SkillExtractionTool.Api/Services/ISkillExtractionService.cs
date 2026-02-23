using SkillExtractionTool.Api.Models;

namespace SkillExtractionTool.Api.Services;

/// <summary>
/// Sends document text to an LLM and returns structured skill data.
/// </summary>
public interface ISkillExtractionService
{
    /// <summary>
    /// Calls the LLM with combined CV and IFU text.
    /// </summary>
    /// <param name="cvText">Extracted text from CV document.</param>
    /// <param name="ifuText">Extracted text from IFU document.</param>
    /// <returns>Structured skills parsed from the LLM JSON response.</returns>
    Task<ExtractedSkills> ExtractSkillsAsync(string cvText, string ifuText);
}
