using System.Text;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using UglyToad.PdfPig;

namespace SkillExtractionTool.Api.Services;

/// <summary>
/// Extracts plain text from PDF and DOCX documents.
/// PDF parsing uses PdfPig; DOCX parsing uses DocumentFormat.OpenXml.
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

        return extension.ToLowerInvariant() switch
        {
            ".pdf"  => ExtractPdfTextAsync(stream),
            ".docx" => ExtractDocxTextAsync(stream),
            _       => throw new NotSupportedException($"Unsupported file format '{extension}'.")
        };
    }

    // -------------------------------------------------------------------------
    // PDF — PdfPig
    // -------------------------------------------------------------------------

    private static async Task<string> ExtractPdfTextAsync(Stream stream)
    {
        // PdfPig requires a byte array; copy the stream first.
        var bytes = await ReadAllBytesAsync(stream);
        var sb = new StringBuilder();

        using var pdf = PdfDocument.Open(bytes);
        foreach (var page in pdf.GetPages())
        {
            foreach (var word in page.GetWords())
            {
                sb.Append(word.Text).Append(' ');
            }
            sb.AppendLine();
        }

        return sb.ToString();
    }

    // -------------------------------------------------------------------------
    // DOCX — DocumentFormat.OpenXml
    // -------------------------------------------------------------------------

    private static Task<string> ExtractDocxTextAsync(Stream stream)
    {
        using var document = WordprocessingDocument.Open(stream, isEditable: false);
        var body = document.MainDocumentPart?.Document?.Body;

        if (body is null)
            return Task.FromResult(string.Empty);

        var sb = new StringBuilder();
        foreach (var paragraph in body.Descendants<Paragraph>())
        {
            var text = paragraph.InnerText;
            if (!string.IsNullOrWhiteSpace(text))
                sb.AppendLine(text);
        }

        return Task.FromResult(sb.ToString());
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private static async Task<byte[]> ReadAllBytesAsync(Stream stream)
    {
        using var ms = new MemoryStream();
        await stream.CopyToAsync(ms);
        return ms.ToArray();
    }
}
