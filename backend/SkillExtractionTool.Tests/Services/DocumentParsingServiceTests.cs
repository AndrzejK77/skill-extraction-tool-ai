using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using FluentAssertions;
using PdfSharpCore.Drawing;
using PdfSharpCore.Pdf;
using SkillExtractionTool.Api.Services;

namespace SkillExtractionTool.Tests.Services;

public class DocumentParsingServiceTests
{
    private readonly DocumentParsingService _sut = new();

    // -------------------------------------------------------------------------
    // DOCX
    // -------------------------------------------------------------------------

    [Fact]
    public async Task ExtractTextAsync_ValidDocx_ReturnsTextContainingContent()
    {
        // Arrange
        const string expectedText = "Software Developer with C# and .NET skills.";
        using var stream = CreateDocxStream(expectedText);

        // Act
        var result = await _sut.ExtractTextAsync(stream, "cv.docx");

        // Assert
        result.Should().Contain("Software Developer");
        result.Should().Contain("C#");
    }

    // -------------------------------------------------------------------------
    // PDF
    // -------------------------------------------------------------------------

    [Fact]
    public async Task ExtractTextAsync_ValidPdf_ReturnsStringWithoutThrowing()
    {
        // Arrange — PdfSharpCore-generated PDF with text
        using var stream = CreatePdfStream("Software Developer");

        // Act
        var act = async () => await _sut.ExtractTextAsync(stream, "cv.pdf");

        // Assert — no exception; parsing completes successfully
        await act.Should().NotThrowAsync();
    }

    // -------------------------------------------------------------------------
    // Unsupported format
    // -------------------------------------------------------------------------

    [Fact]
    public async Task ExtractTextAsync_UnsupportedFormat_ThrowsNotSupportedException()
    {
        // Arrange
        using var stream = new MemoryStream("plain text content"u8.ToArray());

        // Act
        Func<Task> act = async () => await _sut.ExtractTextAsync(stream, "resume.txt");

        // Assert
        await act.Should().ThrowAsync<NotSupportedException>()
            .WithMessage("*Unsupported file format*");
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private static MemoryStream CreateDocxStream(string text)
    {
        var ms = new MemoryStream();
        using (var doc = WordprocessingDocument.Create(ms, WordprocessingDocumentType.Document, true))
        {
            var mainPart = doc.AddMainDocumentPart();
            mainPart.Document = new Document(
                new Body(
                    new Paragraph(
                        new Run(
                            new Text(text)))));
            mainPart.Document.Save();
        }
        ms.Position = 0;
        return ms;
    }

    private static MemoryStream CreatePdfStream(string text)
    {
        var document = new PdfDocument();
        var page = document.AddPage();
        using var gfx = XGraphics.FromPdfPage(page);
        var font = new XFont("Verdana", 12, XFontStyle.Regular);
        gfx.DrawString(text, font, XBrushes.Black, new XPoint(50, 100));

        var ms = new MemoryStream();
        document.Save(ms, false);
        ms.Position = 0;
        return ms;
    }
}
