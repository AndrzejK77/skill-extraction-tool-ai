using OpenAI.Chat;

namespace SkillExtractionTool.Api.Services;

/// <summary>
/// Abstraction over the OpenAI chat completion call.
/// Allows SkillExtractionService to be unit-tested without a live API key.
/// </summary>
public interface IChatCompletionProvider
{
    Task<string> CompleteAsync(IEnumerable<ChatMessage> messages);
}
