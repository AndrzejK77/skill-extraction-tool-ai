# PROJECT SPEC — Skill Extraction Tool

## Purpose

Build a small AI-assisted system that extracts skills from employee documents (CV + IFU) and stores them in a structured format.

The application is intended as an MVP demonstrating AI-generated development workflow.

---

## Functional Requirements

### Upload & Processing

The system must allow users to:

1. Upload a CV document
2. Upload an IFU document
3. Trigger skill extraction

Supported formats:

* PDF
* DOCX
* Plain text (fallback)

---

### AI Skill Extraction

The backend will:

1. Extract raw text from documents
2. Send combined text to an LLM
3. Receive structured skill data
4. Validate and normalize the result
5. Return structured JSON to frontend

---

### Data Handling

For MVP:

* Store results locally (SQLite or in memory)
* No authentication required
* No multi-tenant support

---

## Non-Functional Requirements

* Simple, readable architecture
* Clear separation between frontend and backend
* Designed for AI code generation
* Easy to understand for reviewers

---

## Frontend Specification

### Application Type

Single Page Application (SPA)

### Routing Structure

Public routes:

* `/` — Home / Upload page
* `/results/:id` — Extraction results
* `/history` — Previous extractions (optional)

Admin routes:

* `/admin`
* `/admin/extractions`
* `/admin/system`

---

### Layouts

#### Main Layout

Used for user-facing pages:

* Navigation bar
* Content area
* Footer (optional)

#### Admin Layout

Used for admin pages:

* Sidebar navigation
* Admin header
* Content area

---

### UI Design

Use Tailwind CSS for styling.

Prefer:

* Clean minimal design
* Reusable components
* Responsive layout

---

## Backend Specification (.NET)

### API Responsibilities

* File upload handling
* Document text extraction
* LLM communication
* Data persistence
* Providing REST endpoints

---

### Planned API Endpoints

POST `/api/extraction`

* Upload CV + IFU
* Trigger extraction

GET `/api/extraction/{id}`

* Get extraction result

GET `/api/extractions`

* List previous extractions

---

### Services

The backend should include services for:

* Document parsing
* Skill extraction via AI
* Data storage

---

## Data Model (Conceptual)

ExtractionResult:

* Id
* Timestamp
* ExtractedSkills (JSON)
* OriginalFileNames

---

## AI Integration Strategy

The LLM prompt should instruct the model to:

* Extract skills
* Categorize them
* Return valid JSON only
* Avoid explanations

---

## Coding Guidelines for AI

Prefer:

* Clear naming
* Small methods
* Separation of concerns
* Dependency injection in .NET

Avoid:

* Over-engineering
* Unnecessary abstractions
* Complex patterns

---

## Definition of Done (MVP)

The project is complete when:

* User can upload documents
* Skills are extracted
* Results are displayed
* Multiple pages & layouts exist
* Application builds and runs

---

## Important Context for Copilot

This project is part of an assignment where:

* Most code must be AI-generated
* Developer acts mainly as reviewer
* Clean structure is preferred over clever solutions
