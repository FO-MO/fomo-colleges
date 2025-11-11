# 🚀 Quick Start Guide - Profile Setup

## Prerequisites

- ✅ Strapi backend running on `https://tbs9k5m4-1337.inc1.devtunnels.ms`
- ✅ Node.js and npm installed
- ✅ Next.js project setup

## 5-Minute Setup

### Step 1: Create Strapi Collection (2 minutes)

1. Open Strapi Admin Panel: `https://tbs9k5m4-1337.inc1.devtunnels.ms/admin`

2. Go to **Content-Type Builder** → **Create new collection type**

3. Name it: `student-profile` (singular)

4. Add these fields:

   | Field Name        | Type           | Settings         |
   | ----------------- | -------------- | ---------------- |
   | `studentId`       | Text           | Required, Unique |
   | `name`            | Text           | Required         |
   | `email`           | Email          | -                |
   | `about`           | Long Text      | -                |
   | `college`         | Text           | -                |
   | `course`          | Text           | -                |
   | `graduationYear`  | Text           | -                |
   | `location`        | Text           | -                |
   | `skills`          | JSON           | -                |
   | `interests`       | JSON           | -                |
   | `followers`       | Number         | Default: 0       |
   | `following`       | Number         | Default: 0       |
   | `profilePic`      | Media (Single) | Images only      |
   | `backgroundImage` | Media (Single) | Images only      |

5. Click **Save** and **Restart Server** when prompted

### Step 2: Set Permissions (1 minute)

1. Go to **Settings** → **Roles** → **Authenticated**

2. Expand **STUDENT-PROFILE** section:

   - ✅ Check: `find`, `findOne`, `create`, `update`

3. Expand **UPLOAD** section:

   - ✅ Check: `upload`

4. Click **Save**

### Step 3: Verify Environment Variables (30 seconds)

Check `.env.local` has:

```env
NEXT_PUBLIC_BACKEND_URL=https://tbs9k5m4-1337.inc1.devtunnels.ms
```

### Step 4: Start the App (30 seconds)

```bash
npm run dev
```

### Step 5: Test It! (1 minute)

1. Open: `http://localhost:3000/auth/signup`
2. Create a test account
3. Complete the 5-step profile wizard
4. You're done! 🎉

## What You'll See

### Profile Setup Wizard:

- **Step 1**: Enter your name
- **Step 2**: Add education details
- **Step 3**: Write a bio and location
- **Step 4**: Select skills and interests
- **Step 5**: Upload photos (optional)

### After Setup:

- Access students dashboard
- View/edit your profile at `/students/profile`
- All student routes are now accessible

## Common Issues

### ❌ "Failed to create profile"

**Fix**: Check Strapi permissions (Step 2)

### ❌ "Redirect loop"

**Fix**: Clear browser localStorage or ensure Strapi is running

### ❌ "Images not uploading"

**Fix**: Verify upload permissions in Strapi

### ❌ "Profile not loading"

**Fix**: Check browser console, verify Strapi is running

## Need Help?

- 📖 Read `PROFILE_SETUP_GUIDE.md` for detailed documentation
- 📖 Check `SETUP_SUMMARY.md` for implementation details
- 🔍 Look at browser console for error messages
- 🛠️ Verify Strapi admin panel shows the collection

## Customization

### Add More Skills:

Edit `app/auth/setup-profile/page.tsx`:

```typescript
const AVAILABLE_SKILLS = [
  "React",
  "TypeScript",
  "Your Skill Here", // Add here
];
```

### Change Required Fields:

Edit `lib/strapi/profile.ts` → `hasCompletedProfile()` function

### Modify Wizard Steps:

Edit `app/auth/setup-profile/page.tsx` → `renderStepContent()` function

## That's It!

You now have a complete profile setup system! 🎉

Users will:

1. ✅ Sign up
2. ✅ Complete profile
3. ✅ Access dashboard

All protected routes check for profile completion automatically.
