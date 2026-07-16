# SJR Admin Security Protocol

This document outlines the transition from legacy Basic Auth to the **SJR Master-Grade Security Suite** (Supabase Auth + MFA).

## 🛡 Security Architecture
The admin area (`/admin/*`) is now protected via **Supabase SSR Middleware**. 

### Key Security Features:
1.  **Strict Email Gating**: Only `contact@sanluisai.com` has authorization. Any other authenticated user (even with a valid password) is immediately signed out and redirected to login.
2.  **Modern MFA Support**: Transitioned to Supabase Auth, enabling support for TOTP (Time-based One-Time Passwords).
3.  **Encrypted Sessions**: Sessions are managed via secure, server-side cookies, eliminating the need for insecure browser Basic Auth pop-ups.
4.  **Automatic Redirects**:
    *   Unauthenticated users visiting `/admin/*` are sent to `/admin/login`.
    *   Authorized users visiting `/admin/login` are sent to `/admin/nexus`.

## 🔑 Access Credentials
The credentials for the primary admin are managed via the [Supabase Dashboard](https://supabase.com/dashboard/project/lrzrltjlfvvrdvxqqklm/auth/users).

*   **Authorized User**: `contact@sanluisai.com`
*   **Password**: Managed via Supabase (Legacy `ADMIN_PASS` is no longer used for site access).

## 📱 Multi-Factor Authentication (MFA) Setup
To enable MFA for your account:
1.  Log in to the [Supabase Dashboard](https://supabase.com).
2.  Navigate to **Authentication > Users**.
3.  Select your user profile and ensure MFA is enabled.
4.  (Coming Soon): A dedicated Security tab in the SJR Content Nexus to manage devices locally.

## 🛠 Developer Notes for Codex
*   **Middleware**: Located in `src/middleware.ts` and `src/lib/supabase/middleware.ts`.
*   **Auth Client**: Use `createClient()` from `@/lib/supabase/client` for client-side and `createServerClient` from `@supabase/ssr` for server-side.
*   **Deprecated**: `src/proxy.ts` has been removed. `ADMIN_USER` and `ADMIN_PASS` env vars can be safely removed from production env once migration is confirmed stable.
