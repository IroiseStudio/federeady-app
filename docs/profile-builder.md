# 📋 FedEReady – Profile Builder Module

## 🧭 Purpose
To help federal employees identify their transferable skills by inputting their work experience. This module lets users:
1. Add federal job experiences.
2. Automatically extract skills using an LLM.
3. Review, edit, and manage those skills.
4. Understand how those skills map to other roles.
5. Store all data securely in Supabase.

---

## 🧱 Core Components

### 1. Federal Experience Entry

- Located in the **“Profile Builder”** section under the **“Federal Experiences”** tab.
- Each experience is shown as a **card**.
- A "+ New Experience" card allows users to:
  - Expand an inline form or open a modal.
  - Enter:
    - `Job Title`
    - `Agency`
    - `Description` (free text or paste from USAJobs)
    - `GS or Z Level` (optional)
    - `Start/End Date` (optional)
- Save button stores data in Supabase.
- “Refresh Skills” button triggers LLM-based skill extraction.
- PII Disclaimer:
  > You are responsible for the content you enter. Please avoid including any personally identifiable information (PII), confidential, or sensitive data.

---

### 2. Skill Extraction (LLM-Driven)

- Triggered on save or manual refresh.
- Input: summary text
- Output: flat list of transferable skills (no grouping or explanation by default).
- System avoids duplicates by:
  - Passing known skills to LLM
  - Checking for match locally
- Future enhancement: Add RAG based on GS-level or series mappings.

---

### 3. Skills Tab

- Located under the top tab: **“Skills”**
- Displays a list of all skills across all experiences.
- Features:
  - Inline edit
  - Manual add
  - Delete
  - Optional tags/categories
  - Display:
    - Skill name
    - Source (e.g., LLM/manual)
    - Link to originating experience

---

### 4. 🧠 Skill-to-Job Mapping Toggle

**Goal:** Show users how each skill transfers to other job roles.

- Toggle/icon next to each skill
- On click:
  - Expands section showing roles like:
    > “This skill is commonly required in: Program Analyst, Operations Manager, Program Support Specialist”
- Sourced from:
  - Static mapping (e.g., O*NET)
  - Or dynamic LLM prompt:
    > "What federal or private sector job titles commonly require the skill: 'Stakeholder Engagement'?"

Optional filters:
- Sector: Public vs Private
- Role type: Management, Tech, Admin, etc.

---

## 🗃️ Supabase Schema

### `experiences` Table
| Column      | Type      | Notes |
|-------------|-----------|-------|
| id          | UUID (PK) |  |
| user_id     | UUID (FK) | Supabase auth ID |
| title       | Text      | Job title |
| agency      | Text      | e.g., “USDA” |
| summary     | Text      | Full description |
| gs_level    | Text      | e.g., “GS-13” |
| start_date  | Date      | Optional |
| end_date    | Date      | Optional |
| created_at  | Timestamp | Auto |

### `skills` Table
| Column         | Type      | Notes |
|----------------|-----------|-------|
| id             | UUID (PK) | |
| user_id        | UUID (FK) | |
| experience_id  | UUID (FK) | Optional |
| name           | Text      | Skill name |
| source         | Text      | "llm" or "manual" |
| category       | Text      | Optional (e.g., “Soft”, “Tech”) |
| created_at     | Timestamp | Auto |

### `skill_jobs_map` (optional, cached)
| Column       | Type      | Notes |
|--------------|-----------|-------|
| skill_name   | Text      | e.g., “Process Improvement” |
| job_titles   | JSONB     | List of mapped jobs |
| source       | Text      | “O*NET”, “LLM”, etc. |
| last_updated | Timestamp | For caching |

---

## ✅ UX Fixes & Design Notes

| Feature | Description |
|--------|-------------|
| ✅ Deduplication | Avoids duplicate skill extractions |
| ✅ Refresh Button | Re-run LLM per experience |
| ✅ PII Warning | User is responsible for entered data |
| ✅ Flat Skill Format | Prevents cluttered LLM output |
| ✅ Mapping Toggle | Visualizes where skills are used elsewhere |

---

## 💡 Future Enhancements (Optional)

- Skill proficiency scores
- Export to PDF
- Skill-based job match scores
- Upskilling suggestions
- AI-driven profile summaries