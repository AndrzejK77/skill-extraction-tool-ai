using OpenAI;
using OpenAI.Chat;

namespace SkillExtractionTool.Api.Services;

/// <summary>
/// Production implementation of IChatCompletionProvider.
/// Wraps the OpenAI SDK ChatClient.
/// </summary>
public class OpenAiChatCompletionProvider : IChatCompletionProvider
{
    private const string Model = "gpt-4o-mini";

    private readonly ChatClient _chatClient;

    public OpenAiChatCompletionProvider(IConfiguration configuration)
    {
        var apiKey = configuration["OpenAI:ApiKey"]
            ?? throw new InvalidOperationException("OpenAI:ApiKey is not configured.");

        var openAiClient = new OpenAIClient(apiKey);
        _chatClient = openAiClient.GetChatClient(Model);
    }

    public async Task<string> CompleteAsync(IEnumerable<ChatMessage> messages)
    {
        var completion = await _chatClient.CompleteChatAsync(messages.ToList());
        return completion.Value.Content[0].Text;
    }
}
