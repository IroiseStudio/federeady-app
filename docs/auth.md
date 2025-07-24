# 🔐 Authentication Overview

This app uses [Supabase](https://supabase.com/) for authentication and session management. It supports:

- Email/password login and signup
- Password reset via email link
- Session protection for authenticated routes
- Clean, reusable UI components
- Responsive styling with Tailwind CSS

---

## 🔧 Auth Setup

- Supabase client is configured in `lib/supabase.ts`
- Environment variables required:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 📁 Auth Routes & Pages

All auth pages are located under:

    src/app/auth/
    ├── login/page.tsx
    ├── signup/page.tsx
    ├── reset/page.tsx           → send reset link
    ├── update-password/page.tsx → form from email link


---

## 📦 Session Handling

Sessions are managed using:

- `@supabase/auth-helpers-react` (client-side hook: `useSession`)
- `SessionContextProvider` (in `app/providers.tsx`)
- The provider wraps the entire app via `app/layout.tsx`

Protected routes (like `/dashboard`) check for a valid session and redirect to `/auth/login` if missing.

---

## 🔁 Password Reset Flow

1. User requests reset via `/auth/reset`
2. Supabase sends an email with a link to `/auth/update-password`
3. That page updates the password and redirects to login

Feedback and loading states are included throughout.

---

## 🎨 Design

- Auth pages use a consistent background gradient
- Forms are centered in white cards with shadow
- Button and message colors adapt to success/error state
- Minimal animations for loading and redirects

---

## ✅ To Do / Possible Enhancements

- Add social login (Google, GitHub)
- Add email confirmation check after signup
- Extend user metadata storage
- Add "remember me" option or persistent sessions

---

## 🧩 Reusability

This auth flow is isolated and reusable across projects:
- Self-contained styles
- Uses `/auth/*` route namespace
- Easily extendable with role-based routing or onboarding steps