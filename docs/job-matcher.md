# 🎯 FedEReady – Job Matcher Module

## 🧭 Purpose

The Job Matcher helps users evaluate how well their existing skills align with new job opportunities. By pasting in a job description, users receive **quantitative scores** and **qualitative feedback** about skill alignment—allowing them to decide whether to apply or upskill.

---

## 🎯 Core Features

### 1. Job Description Input

- Textarea for pasting a job description.
- Optional fields:

  - `Job Title`
  - `Job URL`
  - `Application Due Date`

- Button: **“Analyze Match”**

> ⚠️ _Disclaimer:_ Do not paste any confidential or private job postings unless you have permission.

---

### 2. LLM-Driven Skill Alignment

- System fetches user's existing saved skills.
- Uses the `parseWithLLM` function with prompt `match-skills-to-jd`.
- Prompt extracts skills from the job description and compares them to the user's skills using fuzzy matching.

#### LLM Output (Validated Schema):

```json
{
	"alignment_score": 82,
	"matching_skills": ["Policy Analysis", "Stakeholder Engagement"],
	"missing_skills": ["SQL", "Data Visualization"],
	"notes": "Strong policy match; missing technical tools mentioned in job description."
}
```

- On error or malformed response: user-friendly fallback is shown with troubleshooting tips.

#### Input Sanitization

- Before sending to LLM, inputs are cleaned using a `sanitizeInput` function:
  - Collapses excess whitespace
  - Trims long embedded URLs
  - Removes junk characters

---

### 3. Viewing Match Results

- Display includes:
  - **Alignment Score** (0–100 visual bar or badge)
  - **Matching Skills** (tag UI)
  - **Missing Skills**
  - **LLM Feedback** (short explanation)
  - Option to save match

---

### 4. Saving Matches

- If saved, user can enter:
  - `Job Title` (editable)
  - `Job URL` (editable)
  - `Due Date` (editable)
  - `Notes` (editable)
- LLM-generated fields (score, feedback, skills) are **read-only** once saved.

> Saved matches are only stored on request. Unsubmitted matches are never persisted.

---

### 5. Match Statuses

Each saved match is categorized into one of three statuses:

| Status   | Description                            |
| -------- | -------------------------------------- |
| current  | Match with upcoming or no due date     |
| passed   | Auto-assigned if `due_date` is in past |
| archived | Manually archived by user              |

- **Current and passed** are shown together by default.
- **Archived** matches are hidden unless toggled via filter or tab.

---

### 6. “My Matches” View

- Shows all saved matches in a card/table layout.
- Each card includes:
  - Title
  - Alignment score
  - Due date
  - Status label
  - Link to job (if provided)
- Users can:
  - Archive/unarchive a match
  - Edit title, notes, URL, due date
  - View full analysis

---

## 📦 Supabase Schema

### `job_matches` Table

| Column          | Type      | Notes                           |
| --------------- | --------- | ------------------------------- |
| id              | UUID (PK) |                                 |
| user_id         | UUID (FK) | Supabase auth                   |
| title           | Text      | Editable                        |
| job_text        | Text      | Raw JD                          |
| job_url         | Text      | Optional link                   |
| due_date        | Date      | Optional                        |
| alignment_score | Integer   | 0–100                           |
| matching_skills | JSONB     | Array of matched                |
| missing_skills  | JSONB     | Array of missing                |
| notes           | Text      | LLM feedback                    |
| status          | Text      | 'current', 'passed', 'archived' |
| created_at      | Timestamp | Auto                            |

---

## ✅ UX and Logic Decisions

| Area                  | Design                                                                 |
| --------------------- | ---------------------------------------------------------------------- |
| ❌ No Skills          | Lock Job Matcher. Prompt to add skills first                           |
| 🧪 LLM Schema         | Strict schema with fallback handling                                   |
| 🧹 Input Sanitation   | Use `sanitizeInput()` before LLM                                       |
| 🔐 Privacy            | Warn user not to paste sensitive content                               |
| 📊 Match Status Logic | `passed` is derived client-side on load                                |
| 📝 Editability        | Users can edit title, URL, notes, due date—but not AI-generated fields |

---

## ✨ Future Enhancements (Post-MVP)

- Skill suggestions from missing skills
- Add “Application Status” field: applied, rejected, interviewed
- Calendar reminders for due dates
- PDF export of match results
- Upvote/downvote LLM feedback to improve relevance

---

## 🚧 MVP Implementation Checklist

- [ ] Match UI (Paste + Analyze)
- [ ] Skill fetch + prompt call
- [ ] Output view (score, explanation, skills)
- [ ] Save form + editing
- [ ] My Matches list with filter and archive support
- [ ] RLS for job_matches table
- [ ] Input sanitation and error handling
