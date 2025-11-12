# College Profile Page

## Overview

A comprehensive college profile management page that allows colleges to view and edit their institutional information.

## Features

- **View Profile**: Display college information in a clean, organized layout
- **Edit Mode**: Toggle edit mode to update profile information
- **Responsive Design**: Mobile-friendly interface with sidebar navigation
- **Real-time Updates**: Changes are saved to Strapi backend immediately

## Strapi Schema

The page uses the following Strapi collection type:

```json
{
  "kind": "collectionType",
  "collectionName": "college_profiles",
  "info": {
    "singularName": "college-profile",
    "pluralName": "college-profiles",
    "displayName": "college-profile"
  },
  "attributes": {
    "collegeName": { "type": "string" },
    "description": { "type": "string" },
    "ranking": { "type": "string" },
    "location": { "type": "string" },
    "numberOfStudents": { "type": "string" },
    "establishmentDate": { "type": "string" }
  }
}
```

## Files Created/Modified

### New Files:

1. **`app/colleges/profile/page.tsx`**

   - Main profile page component
   - Handles view and edit modes
   - Integrates with Strapi API

2. **`lib/strapi/collegeProfile.ts`**
   - Helper functions for college profile CRUD operations
   - `getCollegeProfile()` - Fetch profile
   - `getCollegeProfileById()` - Fetch by ID
   - `createCollegeProfile()` - Create new profile
   - `updateCollegeProfile()` - Update existing profile
   - `deleteCollegeProfile()` - Delete profile
   - `hasCompletedCollegeProfile()` - Check if profile is complete

### Modified Files:

1. **`components/bars/collegesSideBar.tsx`**
   - Added "Profile" navigation item
   - Added profile icon

## Usage

### Accessing the Profile Page

Navigate to `/colleges/profile` after logging in as a college user.

### Viewing Profile

- All profile information is displayed in a read-only mode by default
- Information includes:
  - College Name
  - Location
  - Description
  - Ranking
  - Number of Students
  - Establishment Date

### Editing Profile

1. Click the "Edit Profile" button in the top right
2. Form fields become editable
3. Make your changes
4. Click "Save Changes" to persist updates
5. Click "Cancel" to discard changes

### Profile Setup Flow

If a college user doesn't have a profile yet:

1. They are redirected to `/auth/college-profile` (setup page)
2. After completing setup, they can access `/colleges/profile`

## API Integration

### Environment Variables

Ensure your `.env.local` has:

```env
NEXT_PUBLIC_BACKEND_URL=https://your-strapi-backend.com
```

### Authentication

All API calls require a valid JWT token stored in `localStorage` as `fomo_token`.

### Endpoints Used

- `GET /api/college-profiles?populate=*` - Fetch profiles
- `GET /api/college-profiles/:documentId?populate=*` - Fetch specific profile
- `POST /api/college-profiles` - Create new profile
- `PUT /api/college-profiles/:documentId` - Update profile
- `DELETE /api/college-profiles/:documentId` - Delete profile

## Styling

- Uses Tailwind CSS for styling
- Follows the existing design system with teal/cyan color scheme
- Responsive breakpoints: mobile (default), sm, lg

## Navigation Structure

```
Colleges Dashboard
├── Dashboard (overview)
├── Students
├── Analytics
├── Placements
└── Profile ← New page
```

## Error Handling

- Redirects to login if no authentication token
- Redirects to setup page if no profile exists
- Shows loading state while fetching data
- Alerts user on save success/failure

## Future Enhancements

- Image upload for college logo
- Cover photo customization
- Social media links
- Contact information
- Courses offered
- Faculty information
- Campus facilities
