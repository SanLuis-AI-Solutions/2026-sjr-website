import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getAllowedAdminEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS || "contact@sanluisai.com")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

async function createAdminSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase auth env vars missing for admin session check.");
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // Route handlers and server actions in this repo only need to read the current auth session.
      },
    },
  });
}

export async function getAdminIdentity() {
  const supabase = await createAdminSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const email = (user.email || "").trim().toLowerCase();
  if (!email) return null;

  if (!getAllowedAdminEmails().has(email)) {
    return null;
  }

  return {
    id: user.id,
    email,
  };
}
