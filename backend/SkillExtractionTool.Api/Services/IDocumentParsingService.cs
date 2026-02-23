namespace SkillExtractionTool.Api.Services;

/// <summary>
/// Extracts plain text from uploaded documents.
/// Supported formats: PDF, DOCX.
/// </summary>
public interface IDocumentParsingService
{
    /// <summary>
    /// Extracts plain text from a document stream.
    /// </summary>
    /// <param name="stream">The document file stream.</param>
    /// <param name="fileName">Original file name, used to determine format.</param>
    /// <returns>Extracted plain text content.</returns>
    /// <exception cref="NotSupportedException">Thrown when the file format is not PDF or DOCX.</exception>
    Task<string> ExtractTextAsync(Stream stream, string fileName);
}
