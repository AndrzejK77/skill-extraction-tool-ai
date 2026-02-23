using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;

namespace SkillExtractionTool.Tests.Integration;

public class ApiIntegrationTests : IClassFixture<ApiFactory>
{
    private readonly HttpClient _client;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public ApiIntegrationTests(ApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    // -------------------------------------------------------------------------
    // GET /api/system/status
    // -------------------------------------------------------------------------

    [Fact]
    public async Task GetSystemStatus_Returns200WithExpectedFields()
    {
        // Act
        var response = await _client.GetAsync("/api/system/status");

        // Assert — HTTP 200
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        // Assert — body contains all expected fields
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        body.TryGetProperty("apiStatus", out var apiStatus).Should().BeTrue();
        body.TryGetProperty("databaseConnected", out var dbConnected).Should().BeTrue();
        body.TryGetProperty("llmConfigured", out var llmConfigured).Should().BeTrue();
        body.TryGetProperty("timestamp", out _).Should().BeTrue();

        apiStatus.GetString().Should().NotBeNullOrEmpty();
        dbConnected.ValueKind.Should().Be(JsonValueKind.True);
    }

    [Fact]
    public async Task GetSystemStatus_ApiStatusField_IsOk()
    {
        // Act
        var response = await _client.GetAsync("/api/system/status");
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();

        // Assert
        body.GetProperty("apiStatus").GetString().Should().BeEquivalentTo("OK");
    }

    // -------------------------------------------------------------------------
    // GET /api/extractions
    // -------------------------------------------------------------------------

    [Fact]
    public async Task GetExtractions_EmptyDatabase_Returns200WithEmptyArray()
    {
        // Act
        var response = await _client.GetAsync("/api/extractions");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        body.ValueKind.Should().Be(JsonValueKind.Array);
        body.GetArrayLength().Should().Be(0);
    }

    [Fact]
    public async Task GetExtractions_Returns200WithArrayShape()
    {
        // Act
        var response = await _client.GetAsync("/api/extractions");

        // Assert — content-type is JSON
        response.Content.Headers.ContentType?.MediaType.Should().Be("application/json");

        // Assert — deserializes as a JSON array without error
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        body.ValueKind.Should().Be(JsonValueKind.Array);
    }
}
