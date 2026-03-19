# Supabase Migration Summary

The frontend backend integration has been migrated from Strapi to Supabase.

## Required environment variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## What changed

- Authentication now uses Supabase Auth (`signUp`, `signInWithPassword`, `signOut`)
- User metadata is persisted to `user_profiles`
- Student profile CRUD now uses `student_profiles`
- College profile CRUD now uses `college_profiles`
- College students page now fetches from Supabase instead of Strapi endpoints

## New Supabase modules

- `lib/supabase/client.ts`
- `lib/supabase/auth.ts`
- `lib/supabase/profile.ts`

## Removed

- `lib/strapi/auth.ts`
- `lib/strapi/profile.ts`
- `lib/strapi/collegeProfile.ts`
- `lib/strapi/strapiData.tsx`
- `STRAPI_INTEGRATION.md`

## Notes

- Existing markdown docs that describe Strapi setup are now historical and should be ignored.
- `fomo_user` in localStorage is still used by UI components for display and routing compatibility.
