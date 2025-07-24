# System Architecture

FedEReady is made up of modular components that work together through a minimal backend.

## 🔗 Components Overview

| Component           | Description |
|---------------------|-------------|
| **Auth System**     | Powered by Supabase; supports GitHub login and RLS-protected data |
| **Profile Builder** | UI where users input and edit federal job experiences |
| **Skill Extractor** | LLM-powered tool to pull skills from experience descriptions |
| **Job Matcher**     | Compares saved skills to job descriptions for match suggestions |
| **Storage & DB**    | Supabase Postgres with row-level security; stores user data securely |
| **Frontend UI**     | Next.js pages/components with TailwindCSS styling |
| **Disclaimer Banner**| Visible reminder about user-responsibility for data privacy |

---

## 🔄 How Components Connect

```mermaid
graph TD
    A[User Login] --> B[Supabase Auth]
    B --> C[Dashboard / Profile Builder]
    C --> D[Experience Input Form]
    D --> E[Skill Extractor (LLM)]
    E --> F[Skills Display + Edit]
    F --> G[Job Matcher (LLM)]
    G --> H[Results Summary]
    F -->|Supabase| DB[(Supabase DB)]
    H -->|Supabase| DB
