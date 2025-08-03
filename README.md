# FedEReady

FedEReady is a free web app designed to help federal employees identify their **transferable skills** when transitioning to new roles inside or outside the government. It combines a simple, clean UI with AI-assisted skill extraction and job matching—grounded in real-world hiring workflows.

## 🚀 Why It Matters

Navigating a federal career change is hard—especially when job descriptions and resumes don't line up neatly. FedEReady solves this by helping users:

- **Capture** their federal experience in a structured format
- **Extract** transferable skills using AI
- **Match** those skills to new job descriptions
- **Understand** how their experience aligns with civilian roles

This empowers federal workers to transition confidently and make informed career decisions.

## 🛠️ Tech Stack

Built for speed, usability, and zero-cost hosting:

- **Frontend:** Next.js (App Router), TailwindCSS
- **Auth:** Supabase (email + GitHub login)
- **Database:** Supabase (PostgreSQL + RLS)
- **AI:** OpenAI (for skill extraction + job matching)
- **Hosting:** Vercel
- **Storage:** Supabase Edge Functions + client-side logic
- **Others:** GitHub Copilot, VSCode, React Markdown, etc.

> ⚙️ The project prioritizes low-cost deployment while showcasing how to build AI-enabled tools that solve real career navigation problems.

## 📂 Documentation

Explore the full documentation:

- 📘 [Project Overview & Impact](docs/project-overview.md)
- 🧩 [System Architecture & Components](docs/architecture.md)
- 🧠 [LLM Module](docs/llm-parsing-module.md)
- 🔐 [Authentication](docs/auth.md)
- 📋 [Profile Builder](docs/profile-builder.md)
- 🎯 [Job Matcher](docs/job-matcher.md)
