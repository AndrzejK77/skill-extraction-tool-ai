namespace SkillExtractionTool.Api.Services;

/// <summary>
/// Stub implementation — real document parsing (PDF, DOCX) not yet implemented.
/// </summary>
public class DocumentParsingService : IDocumentParsingService
{
    private static readonly HashSet<string> SupportedExtensions =
        new(StringComparer.OrdinalIgnoreCase) { ".pdf", ".docx" };

    public Task<string> ExtractTextAsync(Stream stream, string fileName)
    {
        var extension = Path.GetExtension(fileName);

        if (!SupportedExtensions.Contains(extension))
        {
            throw new NotSupportedException(
                $"Unsupported file format '{extension}'. Only PDF and DOCX are accepted.");
        }

        // TODO: Implement real text extraction using PdfPig (PDF) and DocumentFormat.OpenXml (DOCX)
        return Task.FromResult($"[STUB] Extracted text from {fileName}");
    }
}
