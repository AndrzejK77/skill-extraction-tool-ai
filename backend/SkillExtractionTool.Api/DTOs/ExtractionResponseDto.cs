using SkillExtractionTool.Api.Models;

namespace SkillExtractionTool.Api.DTOs;

public class ExtractionResponseDto
{
    public Guid Id { get; set; }
    public DateTime Timestamp { get; set; }
    public string CvFileName { get; set; } = string.Empty;
    public string IfuFileName { get; set; } = string.Empty;
    public ExtractedSkills? Skills { get; set; }
}
