# Strapi Authentication & Profile Integration

This project was updated to use Strapi's built-in authentication instead of Supabase, with a complete profile setup flow.

## Files changed/added:

### Authentication:

- `lib/strapi/auth.ts` - helper functions: `strapiLogin`, `strapiRegister`, `setAuthToken`, `getAuthToken`, `removeAuthToken`, `fetchMe`
- `app/auth/login/page.jsx` - login page now calls `strapiLogin` and stores the JWT
- `app/auth/signup/page.jsx` - signup page now calls `strapiRegister` and redirects to profile setup
- `app/auth/logout/page.jsx` - clears token and redirects
- `components/UserProfileClient.jsx` - client component that reads token, fetches `/api/users/me`, and shows sign out

### Profile Management:

- `lib/strapi/profile.ts` - profile API functions: `getStudentProfile`, `createStudentProfile`, `updateStudentProfile`, `uploadFile`, `hasCompletedProfile`
- `lib/useProfileCheck.ts` - custom hook to check if user has completed profile setup
- `app/auth/setup-profile/page.tsx` - multi-step profile setup wizard for new users
- `app/students/profile/page.tsx` - updated to load profile from Strapi API
- `app/students/layout.tsx` - updated to check profile completion and redirect if needed
- `components/student-section/EditProfileModal.tsx` - updated to work with Strapi API

## Environment variables:

Add these to your `.env.local` file:

```
NEXT_PUBLIC_BACKEND_URL=https://tbs9k5m4-1337.inc1.devtunnels.ms
```

## User Flow:

1. **Signup** → User registers at `/auth/signup`
2. **Profile Setup** → Redirected to `/auth/setup-profile` (5-step wizard)
3. **Dashboard** → After profile completion, user can access `/students` and other protected pages

## Profile Setup Steps:

1. **Basic Information** - Name
2. **Education** - Institution, Major, Graduation Year
3. **About You** - Bio, Location
4. **Skills & Interests** - Select from predefined lists
5. **Profile Images** - Upload profile picture and background (optional)

## Strapi Backend Requirements:

Create a `student-profiles` collection in Strapi with the following fields:

- `studentId` (Text, Required) - References the user's documentId
- `name` (Text, Required)
- `email` (Email)
- `about` (Long Text)
- `college` (Text)
- `course` (Text)
- `graduationYear` (Text)
- `location` (Text)
- `skills` (JSON)
- `interests` (JSON)
- `followers` (Number, Default: 0)
- `following` (Number, Default: 0)
- `profilePic` (Media, Single)
- `backgroundImage` (Media, Single)

### Permissions:

Set up these permissions in Strapi:

**Authenticated users should be able to:**

- `student-profiles` → `find`, `findOne`, `create`, `update` (own records)
- `upload` → `upload`

Notes:

- For development we store the JWT in a non-HttpOnly cookie and localStorage for ease. For production, prefer server-side HttpOnly cookies set from a secure route.
- Strapi registration at `/api/auth/local/register` may require email confirmation depending on Strapi settings. If email confirmation is enabled, registration may return a user object without `jwt` until the email is confirmed.

## Testing:

1. Start Strapi backend (default `https://tbs9k5m4-1337.inc1.devtunnels.ms`)
   - Make sure you've created the `student-profiles` collection
   - Configure permissions for authenticated users
2. Start this Next.js app: `npm run dev`
3. Go to `http://localhost:3000/auth/signup` and register a new account
4. Complete the profile setup wizard
5. You'll be redirected to `/students` dashboard
6. Visit `/students/profile` to view and edit your profile
7. Test login at `http://localhost:3000/auth/login`

## Features:

- ✅ Complete authentication flow with Strapi
- ✅ Multi-step profile creation wizard
- ✅ Profile completion check on protected routes
- ✅ Image upload for profile and background pictures
- ✅ Edit profile with real-time updates
- ✅ Skills and interests selection
- ✅ Education and location information
- ✅ Responsive design for all screen sizes

Security:

- This integration is intended as a development convenience. For production use:
  - Set tokens via server-side endpoints and HttpOnly cookies.
  - Use CSRF protections if needed.

If you want, I can convert token storage to server-side HttpOnly cookies and create API route handlers for login/register/logout which will set/clear cookies securely. Let me know.
