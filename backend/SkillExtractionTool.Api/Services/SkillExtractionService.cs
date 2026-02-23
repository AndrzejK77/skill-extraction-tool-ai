using System.Text.Json;
using OpenAI.Chat;
using SkillExtractionTool.Api.Models;

namespace SkillExtractionTool.Api.Services;

/// <summary>
/// Calls the OpenAI Chat Completions API to extract structured skills from CV and IFU text.
/// Enforces strict JSON-only output via a system prompt.
/// Depends on IChatCompletionProvider to allow unit testing without a live API key.
/// </summary>
public class SkillExtractionService : ISkillExtractionService
{
    private const string SystemPrompt = """
        You are a skill extraction assistant.
        Analyze the provided document text and extract skills.
        You MUST respond with valid JSON only. No explanations, no markdown, no code blocks.
        Use exactly this structure:
        {
          "technicalSkills": [],
          "softSkills": [],
          "tools": [],
          "experienceAreas": []
        }
        Fill each array with concise strings. Return empty arrays if nothing is found.
        """;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    private readonly IChatCompletionProvider _chatProvider;

    public SkillExtractionService(IChatCompletionProvider chatProvider)
    {
        _chatProvider = chatProvider;
    }

    public async Task<ExtractedSkills> ExtractSkillsAsync(string cvText, string ifuText)
    {
        var userMessage = $"""
            CV Document:
            {cvText}

            IFU Document:
            {ifuText}
            """;

        var messages = new List<ChatMessage>
        {
            new SystemChatMessage(SystemPrompt),
            new UserChatMessage(userMessage)
        };

        var responseText = await _chatProvider.CompleteAsync(messages);

        var skills = JsonSerializer.Deserialize<ExtractedSkills>(responseText, JsonOptions)
            ?? throw new InvalidOperationException("OpenAI returned null or unparseable JSON.");

        return skills;
    }
}

