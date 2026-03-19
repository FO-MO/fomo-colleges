import { hasSupabaseEnv, supabase } from "@/lib/supabase/client";

/* eslint-disable @typescript-eslint/no-explicit-any */

export type AppUser = {
  id: string;
  email: string;
  username: string;
  documentId: string;
  usertype?: string;
};

// Supabase auth typings can vary across versions; cast to any for method access
const auth: any = supabase.auth;

function toAppUser(
  authUser: { id: string; email?: string | null } | null,
  profile?: { username: string; usertype?: string | null } | null
): AppUser | null {
  if (!authUser?.id || !authUser.email) return null;

  return {
    id: authUser.id,
    documentId: authUser.id,
    email: authUser.email,
    username: profile?.username || authUser.email.split("@")[0] || "User",
    usertype: profile?.usertype || undefined,
  };
}

async function upsertUserProfile(
  userId: string,
  email: string,
  username: string,
  usertype?: string
) {
  if (!hasSupabaseEnv) return;

  // Ensure there is an active authenticated session before attempting
  // a client-side upsert. If the user must confirm their email first,
  // `auth.signUp()` may return no session and the request will be
  // rejected by row-level security (RLS).
  try {
    const {
      data: { session },
    } = await auth.getSession();

    if (!session) {
      console.warn("No active session; skipping user_profiles upsert");
      return;
    }

    const { error } = await supabase.from("user_profiles").upsert(
      {
        id: userId,
        email,
        username,
        usertype: usertype || null,
        provider: "email",
        confirmed: true,
        blocked: false,
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error("Failed to upsert user_profiles:", error.message);
    }
  } catch (e: any) {
    console.error("Error checking session before upsert:", e?.message || e);
  }
}

export async function loginWithSupabase(email: string, password: string) {
  if (!hasSupabaseEnv) {
    return {
      user: null,
      error:
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local",
    };
  }

  const { data, error } = await auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { user: null, error: error?.message || "Login failed" };
  }

  const { data: userProfile } = await supabase
    .from("user_profiles")
    .select("username, usertype")
    .eq("id", data.user.id)
    .maybeSingle();

  const userType = userProfile?.usertype || data.user?.user_metadata?.usertype;
  if (userType && userType !== "college") {
    await auth.signOut();
    return {
      user: null,
      error: "This account is not registered as a college account.",
    };
  }

  const appUser = toAppUser(data.user, userProfile);
  if (appUser) {
    localStorage.setItem("fomo_user", JSON.stringify(appUser));
  }

  return { user: appUser, error: null };
}

export async function signupWithSupabase(
  username: string,
  email: string,
  password: string,
  usertype = "college"
) {
  if (!hasSupabaseEnv) {
    return {
      user: null,
      error:
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local",
      requiresEmailConfirmation: false,
    };
  }

  const { data, error } = await auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        usertype,
      },
    },
  });

  if (error || !data.user) {
    return {
      user: null,
      error: error?.message || "Registration failed",
      requiresEmailConfirmation: false,
    };
  }

  const appUser = toAppUser(data.user, { username, usertype });
  const requiresEmailConfirmation = !data.session;

  // Only attempt a client-side upsert when a session is present. If the
  // signup requires email confirmation `data.session` will be null and
  // the RLS policy will reject unauthenticated requests.
  if (!requiresEmailConfirmation) {
    await upsertUserProfile(data.user.id, email, username || email, usertype);
  }

  if (appUser && !requiresEmailConfirmation) {
    localStorage.setItem("fomo_user", JSON.stringify(appUser));
  }

  return { user: appUser, error: null, requiresEmailConfirmation };
}

export async function getCurrentAuthUser() {
  if (!hasSupabaseEnv) return null;

  const {
    data: { user },
  } = await auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("username, usertype")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile && user.email) {
    const fallbackUsername =
      user.user_metadata?.username || user.email.split("@")[0] || "User";
    const fallbackUsertype = user.user_metadata?.usertype || "college";
    await upsertUserProfile(user.id, user.email, fallbackUsername, fallbackUsertype);
  }

  const resolvedProfile =
    profile ||
    (user.email
      ? {
          username: user.user_metadata?.username || user.email.split("@")[0] || "User",
          usertype: user.user_metadata?.usertype || "college",
        }
      : null);

  return toAppUser(user, resolvedProfile);
}

export async function signOutSupabase() {
  if (!hasSupabaseEnv) {
    try {
      localStorage.removeItem("fomo_user");
    } catch {}
    return;
  }

  await auth.signOut();
  try {
    localStorage.removeItem("fomo_user");
  } catch {}
}

export async function getAuthToken() {
  if (!hasSupabaseEnv) return null;

  const {
    data: { session },
  } = await auth.getSession();
  return session?.access_token || null;
}
