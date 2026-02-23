namespace SkillExtractionTool.Api.DTOs;

public class SystemStatusDto
{
    public string ApiStatus { get; set; } = "ok";
    public bool DatabaseConnected { get; set; }
    public bool LlmConfigured { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
