# Profile Setup Guide

This document explains how to set up the profile system after user signup.

## Overview

After a user signs up, they are redirected to a profile setup wizard where they complete their profile in 5 steps:

1. **Basic Information** - Name
2. **Education** - Institution, Major, Graduation Year
3. **About You** - Bio, Location
4. **Skills & Interests** - Select from predefined options
5. **Profile Images** - Optional profile and background images

## Flow Diagram

```
Signup (/auth/signup)
    ↓
Profile Setup (/auth/setup-profile)
    ↓
Students Dashboard (/students)
```

## Protected Routes

All routes under `/students/*` are protected and check if the user has completed their profile:

- If no profile or incomplete → Redirect to `/auth/setup-profile`
- If profile complete → Allow access

This check is implemented in `/app/students/layout.tsx` using the `useProfileCheck` hook.

## Key Files

### Backend Integration

- **`lib/strapi/profile.ts`** - API functions for profile operations
  - `getStudentProfile()` - Fetch user profile
  - `createStudentProfile()` - Create new profile
  - `updateStudentProfile()` - Update existing profile
  - `uploadFile()` - Upload images to Strapi
  - `hasCompletedProfile()` - Check if profile is complete

### Profile Check

- **`lib/useProfileCheck.ts`** - Custom hook to verify profile completion
  - Automatically redirects to setup page if incomplete
  - Shows loading state during checks
  - Can be used in any protected component

### Pages

- **`app/auth/setup-profile/page.tsx`** - Multi-step wizard for profile creation
- **`app/students/profile/page.tsx`** - View and edit profile page
- **`app/students/layout.tsx`** - Protected layout with profile check

### Components

- **`components/student-section/EditProfileModal.tsx`** - Modal for editing profile

## Strapi Collection Schema

Create a collection called `student-profiles` in Strapi with these fields:

| Field Name      | Type           | Required | Notes                              |
| --------------- | -------------- | -------- | ---------------------------------- |
| studentId       | Text           | Yes      | User's documentId from Strapi auth |
| name            | Text           | Yes      | User's full name                   |
| email           | Email          | No       | User's email (reference only)      |
| about           | Long Text      | Yes      | Bio/description                    |
| college         | Text           | Yes      | Institution name                   |
| course          | Text           | Yes      | Major/course of study              |
| graduationYear  | Text           | Yes      | Expected graduation year           |
| location        | Text           | Yes      | City, State/Country                |
| skills          | JSON           | No       | Array of skill strings             |
| interests       | JSON           | No       | Array of interest strings          |
| followers       | Number         | No       | Default: 0                         |
| following       | Number         | No       | Default: 0                         |
| profilePic      | Media (Single) | No       | Profile picture                    |
| backgroundImage | Media (Single) | No       | Cover/background image             |

### Required Permissions

In Strapi → Settings → Roles → Authenticated:

**student-profiles:**

- ✅ find (to read profiles)
- ✅ findOne (to read specific profile)
- ✅ create (to create own profile)
- ✅ update (to update own profile)

**upload:**

- ✅ upload (to upload images)

## Customization

### Adding New Skills/Interests

Edit the constants in `/app/auth/setup-profile/page.tsx`:

```typescript
const AVAILABLE_SKILLS = [
  "React",
  "TypeScript",
  // Add more skills...
];

const AVAILABLE_INTERESTS = [
  "Artificial Intelligence",
  "Web Development",
  // Add more interests...
];
```

### Changing Required Fields

Update the validation in `lib/strapi/profile.ts` → `hasCompletedProfile()`:

```typescript
export async function hasCompletedProfile(
  studentId: string,
  token: string
): Promise<boolean> {
  const profile = await getStudentProfile(studentId, token);
  if (!profile) return false;

  // Customize which fields are required
  return !!(
    profile.name &&
    profile.college &&
    profile.course &&
    profile.graduationYear &&
    profile.about
  );
}
```

### Modifying Setup Steps

Edit `/app/auth/setup-profile/page.tsx` and modify the `renderStepContent()` function to add/remove/reorder steps.

## Troubleshooting

### Profile doesn't save

- Check Strapi permissions for authenticated users
- Check browser console for API errors
- Verify `NEXT_PUBLIC_BACKEND_URL` is set correctly

### Stuck in redirect loop

- Clear localStorage: `localStorage.clear()`
- Check if Strapi backend is running
- Verify token is valid

### Images not uploading

- Check Strapi upload permissions
- Verify file size is under limit (default 5MB)
- Check network tab for upload errors

### Profile not loading

- Verify `studentId` is correctly stored in localStorage as `fomo_user`
- Check if profile record exists in Strapi
- Check API endpoint returns correct data format

## Future Enhancements

- [ ] Add profile completeness percentage indicator
- [ ] Allow custom skills/interests input
- [ ] Add profile visibility settings (public/private)
- [ ] Implement profile verification badge
- [ ] Add social media links section
- [ ] Enable portfolio/project attachments
- [ ] Add resume upload functionality
