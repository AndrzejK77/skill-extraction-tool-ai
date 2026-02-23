using System.Text.Json;
using FluentAssertions;
using Moq;
using OpenAI.Chat;
using SkillExtractionTool.Api.Services;

namespace SkillExtractionTool.Tests.Services;

public class SkillExtractionServiceTests
{
    private readonly Mock<IChatCompletionProvider> _mockProvider = new();
    private readonly SkillExtractionService _sut;

    public SkillExtractionServiceTests()
    {
        _sut = new SkillExtractionService(_mockProvider.Object);
    }

    // -------------------------------------------------------------------------
    // Valid JSON response
    // -------------------------------------------------------------------------

    [Fact]
    public async Task ExtractSkillsAsync_ValidJson_ReturnsPopulatedExtractedSkills()
    {
        // Arrange
        const string validJson = """
            {
              "technicalSkills": ["C#", ".NET"],
              "softSkills": ["Communication", "Teamwork"],
              "tools": ["Git", "Visual Studio"],
              "experienceAreas": ["Backend Development"]
            }
            """;

        _mockProvider
            .Setup(p => p.CompleteAsync(It.IsAny<IEnumerable<ChatMessage>>()))
            .ReturnsAsync(validJson);

        // Act
        var result = await _sut.ExtractSkillsAsync("cv text", "ifu text");

        // Assert
        result.Should().NotBeNull();
        result.TechnicalSkills.Should().Contain("C#").And.Contain(".NET");
        result.SoftSkills.Should().Contain("Communication");
        result.Tools.Should().HaveCount(2).And.Contain("Git");
        result.ExperienceAreas.Should().ContainSingle().Which.Should().Be("Backend Development");
    }

    [Fact]
    public async Task ExtractSkillsAsync_ValidJson_CallsProviderExactlyOnce()
    {
        // Arrange
        const string validJson = """
            {
              "technicalSkills": [],
              "softSkills": [],
              "tools": [],
              "experienceAreas": []
            }
            """;

        _mockProvider
            .Setup(p => p.CompleteAsync(It.IsAny<IEnumerable<ChatMessage>>()))
            .ReturnsAsync(validJson);

        // Act
        await _sut.ExtractSkillsAsync("cv text", "ifu text");

        // Assert
        _mockProvider.Verify(
            p => p.CompleteAsync(It.IsAny<IEnumerable<ChatMessage>>()),
            Times.Once);
    }

    // -------------------------------------------------------------------------
    // Invalid JSON response
    // -------------------------------------------------------------------------

    [Fact]
    public async Task ExtractSkillsAsync_InvalidJson_ThrowsJsonException()
    {
        // Arrange
        _mockProvider
            .Setup(p => p.CompleteAsync(It.IsAny<IEnumerable<ChatMessage>>()))
            .ReturnsAsync("This is not valid JSON at all");

        // Act
        Func<Task> act = async () => await _sut.ExtractSkillsAsync("cv text", "ifu text");

        // Assert
        await act.Should().ThrowAsync<JsonException>();
    }
}
