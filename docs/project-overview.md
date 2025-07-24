# Project Overview

FedEReady helps federal employees uncover the true value of their experience.

## 🎯 Core Goals

1. **Input Experience** – Let users record past federal job roles in a structured way
2. **Extract Skills** – Use AI to pull out relevant, transferable skills
3. **Match Jobs** – Match their experience to new job descriptions
4. **Empower Users** – Give users ownership over their skill narrative

---

## 🧩 What Problem Does This Solve?

Federal resumes often:
- Use unfamiliar jargon
- Don’t map clearly to private-sector roles
- Miss out on highlighting transferable skills

FedEReady bridges that gap, making skills more visible and reusable.

---

## 🛠 Tech Highlights (With Intent)

| Area          | Tech Used       | Why It Matters                                  |
|---------------|------------------|--------------------------------------------------|
| Frontend      | Next.js, Tailwind | Fast, clean UI; SSR-ready for future scaling     |
| Auth          | Supabase         | Easy OAuth, no custom backend needed             |
| AI Integration| OpenAI API       | Uses LLMs for skill extraction + resume match    |
| DB + API      | Supabase (Postgres) | Fast, structured, supports RLS for auth          |
| Hosting       | Vercel           | Free-tier friendly, CI/CD built-in               |

---

## 💡 Real-World Relevance

- Designed based on real user workflows (career coaches, resume reviewers)
- Balances AI capabilities with user control (editable skills list)
- Emphasizes privacy: users are responsible for inputs, no resume scraping

---

## 🔄 Roadmap Snapshot

- [x] Login system (email + GitHub)
- [x] Profile builder: federal experience + skills
- [ ] Job matcher: paste JD, see matched skills
- [ ] Save/share results
- [ ] Responsive polish for mobile
