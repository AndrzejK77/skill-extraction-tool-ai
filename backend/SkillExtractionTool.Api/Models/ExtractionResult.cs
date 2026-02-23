namespace SkillExtractionTool.Api.Models;

public class ExtractionResult
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string CvFileName { get; set; } = string.Empty;
    public string IfuFileName { get; set; } = string.Empty;

    /// <summary>
    /// Serialized JSON from the LLM, deserialized on read into ExtractedSkills.
    /// </summary>
    public string ExtractedSkillsJson { get; set; } = string.Empty;
}
