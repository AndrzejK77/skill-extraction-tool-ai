# skill-extraction-tool-ai
A test project extracting the necessary skills from a CV.

# Skill Extraction Tool (AI-Generated Project)

## Overview

Skill Extraction Tool is a web application that analyzes a new employee’s CV and IFU (Individual Functional Unit / job description) and extracts skills into a structured format.

This project is built primarily using AI tools (GitHub Copilot, ChatGPT), with the developer acting mainly as a reviewer.

The application demonstrates:

* AI-assisted document processing
* Modern web architecture (React + .NET)
* Multi-page UI with routing and layouts
* Integration with LLM services for skill extraction

---

## Core Features (MVP)

### Document Processing

* Upload CV (PDF or DOCX)
* Upload IFU document
* Extract text from documents
* Send content to LLM for skill extraction

### Skill Extraction

The system should identify:

* Technical skills
* Soft skills
* Tools & technologies
* Experience areas
* Seniority indicators (optional)

Output format example:

```json
{
  "technicalSkills": ["C#", ".NET", "React"],
  "softSkills": ["Communication", "Leadership"],
  "tools": ["Git", "Docker"],
  "experienceAreas": ["Web Development", "Cloud"]
}
```

### Data Storage

* Store extracted skills in structured format
* Associate results with uploaded documents
* Enable later retrieval

---

## UI Requirements

The application must include:

* Multiple pages
* Client-side routing
* At least two layouts:

  * Main layout (user features)
  * Admin layout (management view)

### Implemented Pages

**Main Area**

* Home / Upload page — upload CV + IFU, trigger extraction
* Extraction results page — view structured skill tags by category
* History page — list all past extractions with links to results

**Admin Area**

* Dashboard — overview placeholder
* Extractions — table with view + delete per row
* System status — live API, database, and LLM health indicators

---

## Technology Stack

### Frontend

* React
* TypeScript
* Vite
* React Router
* Tailwind CSS

### Backend

* ASP.NET Core Web API (.NET)
* C#
* Minimal APIs or Controllers

### AI Integration

* LLM service (e.g., OpenAI API)
* Used for skill extraction from text

### Storage

* SQLite or in-memory database for MVP

---

## Prerequisites

| Requirement | Version |
|---|---|
| [.NET SDK](https://dotnet.microsoft.com/download) | 8.0 or later |
| [Node.js](https://nodejs.org/) | 18.0 or later |
| OpenAI API key | Required for skill extraction |

---

## Configuration

Before running the application, set your OpenAI API key in:

```
backend/SkillExtractionTool.Api/appsettings.json
```

```json
{
  "OpenAI": {
    "ApiKey": "your-api-key-here"
  }
}
```

> **Note:** `appsettings.json` is committed as a config template. The API key field is intentionally empty — do not commit real keys. Use `appsettings.Development.json` (git-ignored) or an environment variable for sensitive values.

---

## Architecture Overview

Frontend (React SPA)
→ communicates via REST API →
Backend (.NET API)
→ processes documents & calls LLM →
Returns structured skill data

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd skill-extraction-tool-ai
```

### 2. Run the backend

```bash
cd backend/SkillExtractionTool.Api
dotnet run
```

The API starts at **http://localhost:5000**.
Swagger UI is available at **http://localhost:5000/swagger**.

The SQLite database (`skills.db`) is created automatically on first run.

### 3. Run the frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The app starts at **http://localhost:5173**.
All `/api/*` requests are proxied to `http://localhost:5000` automatically.

---

## Testing

### Backend (xUnit)

Test project: `backend/SkillExtractionTool.Tests`

**Stack:** xUnit · FluentAssertions · Moq · Microsoft.AspNetCore.Mvc.Testing · EF Core InMemory

**Unit tests** (`Services/`):
| Test class | Coverage |
|---|---|
| `DocumentParsingServiceTests` | PDF extraction (PdfPig), DOCX extraction (OpenXml), `NotSupportedException` for unsupported formats |
| `SkillExtractionServiceTests` | Valid JSON → populated `ExtractedSkills`, invalid JSON → `JsonException`, provider called exactly once |

**Integration tests** (`Integration/`):

`ApiFactory` uses `WebApplicationFactory<Program>` with:
- SQLite replaced by an isolated EF Core in-memory database
- `IChatCompletionProvider` replaced by a Moq stub (no real OpenAI calls)

| Test | Covers |
|---|---|
| `GetSystemStatus_Returns200WithExpectedFields` | HTTP 200 + all four status fields present |
| `GetSystemStatus_ApiStatusField_IsOk` | `apiStatus` value is `"ok"` |
| `GetExtractions_EmptyDatabase_Returns200WithEmptyArray` | HTTP 200 + empty JSON array |
| `GetExtractions_Returns200WithArrayShape` | `Content-Type: application/json` + JSON array |

**Run:**
```bash
cd backend/SkillExtractionTool.Tests
dotnet test
```

---

### Frontend (Vitest)

Test directory: `frontend/src/pages/__tests__/`

**Stack:** Vitest · React Testing Library · jest-dom · userEvent · jsdom

| Test file | Coverage |
|---|---|
| `HomePage.test.tsx` | File inputs render, labels render, Extract Skills button present and enabled |
| `HomePageUpload.test.tsx` | Files selected → `uploadExtraction` called with correct args, navigation to `/results/{id}`, validation error when no files, API error displayed, loading state shown |
| `ResultsPage.test.tsx` | Loading spinner shown, skill tags render after data loads, file names displayed, error state |
| `HistoryPage.test.tsx` | Empty-state message, one row per extraction, View Results button per row, error state |

All API calls are mocked with `vi.mock()`. No real network requests are made in tests.

**Run:**
```bash
cd frontend
npm run test:run    # single pass
npm run test        # watch mode
```

---

## Project Goal (Course Requirement)

Deliver a working application where:

* At least 90% of the code is generated by AI tools
* Developer acts mainly as reviewer
* Prompt workflow and insights are documented

---

## AI Usage

AI tools used:

* GitHub Copilot (primary code generation)
* ChatGPT (architecture, prompts, review)

Documentation of prompts and workflow will be included in this repository.

---

## Non-Goals (MVP Scope Control)

To keep the project manageable:

* No authentication (unless required later)
* No complex permissions
* No production deployment requirements
* No advanced document parsing edge cases

---

## Development Approach

1. Define architecture with AI
2. Generate project structure
3. Implement features incrementally using AI prompts
4. Review and adjust generated code
5. Document prompts and insights

---

## Notes for AI Assistants (Copilot Context)

This project prioritizes:

* Clean architecture
* Readable code
* Separation of concerns
* Simple maintainable solutions over complex ones

Prefer:

* Explicit types
* Clear folder structures
* Reusable components
* Small focused services

All prompts and workflow logs are stored in PROMPTS.md
