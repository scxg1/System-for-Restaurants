# Setup Guide

Complete setup guide for The Foodie Wagon platform with Supabase (database + auth + realtime) and Cloudinary (image uploads).

---

## What You Need

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| **Supabase** | Database, Auth, Realtime | 500MB, 50K MAU |
| **Cloudinary** | Image storage | 25GB storage |
| **Vercel** | Hosting | 100GB bandwidth |
| **pnpm** | Package manager | - |

**Total cost to start: 0 EUR**

---

## Step-by-Step Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in with GitHub
2. Click **New Project** and configure:
   - Name: `foodie-wagon`
   - Region: Choose the closest to your location
   - Database password: Save this securely
3. Wait ~2 minutes for the project to be ready

### 2. Run the Database Schema

1. In Supabase dashboard, go to **SQL Editor** > **New query**
2. Open `supabase/schema.sql` from this project
3. Copy the entire contents and paste into the SQL Editor
4. Click **Run** (or Ctrl+Enter)
5. Wait for the success confirmation

This creates:
- Tables: `categories`, `products`, `branches`, `orders`, `settings`
- RLS (Row Level Security) policies
- Realtime subscriptions
- Seed data (35+ products, 7 categories, 1 branch, settings)

### 3. Create the Admin User

1. In Supabase dashboard, go to **Authentication** > **Users** > **Add user** > **Create new user**
2. Enter:
   - Email: your admin email (e.g., `admin@foodiewagon.de`)
   - Password: choose a strong password
   - Enable **Auto Confirm User**
3. Click **Create user**

### 4. Get API Keys

In Supabase dashboard, go to **Settings** > **API**:
- Copy **Project URL** → this is your `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon public** key → this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 5. Set Up Cloudinary (Optional — for Image Uploads)

1. Go to [cloudinary.com](https://cloudinary.com) and sign up
2. From the **Dashboard**, copy your **Cloud Name**
3. Go to **Settings** > **Upload** > **Upload presets** > **Add upload preset**:
   - Preset name: `foodie-wagon-uploads`
   - **Signing Mode: Unsigned** — this is required
   - Folder: `foodie-wagon` (optional)
4. Save and copy the preset name

### 6. Configure Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=foodie-wagon-uploads
```

### 7. Run the Project

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Login to the dashboard at [http://localhost:3000/login](http://localhost:3000/login) using the credentials you created in Step 3.

---

## How It Works

### For Customers (Storefront)
- Browse menu loaded from Supabase
- Place orders saved directly to Supabase
- See admin changes in real-time (Realtime)

### For Admins (Dashboard)
- Login via Supabase Auth
- See all orders from all customers instantly
- Add/edit products with image uploads to Cloudinary
- Changes propagate to all open browsers in real-time

### Security (RLS)
- **Visitors** (anon): Can read products and create orders only
- **Admins** (authenticated): Full CRUD access
- Customers cannot see other customers' orders

### Order Sync Reliability
Orders are synced to the dashboard via three layers:
1. **Supabase Realtime** — instant push on INSERT
2. **BroadcastChannel** — cross-tab fallback within the same browser
3. **Polling** — dashboard fetches new orders every 10 seconds

---

## Deploy to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push
```

### 2. Configure Vercel

1. Go to [vercel.com](https://vercel.com) and import your GitHub repository
2. Framework preset: **Next.js** (auto-detected)
3. Add environment variables from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
4. Click **Deploy**

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Supabase is not configured" | Check `.env.local` exists and has valid values, restart dev server |
| Images not uploading | Verify Cloudinary preset is set to **Unsigned** |
| Cannot login | Create the user in Supabase Auth first (Step 3) |
| No products showing | Run `schema.sql` completely in SQL Editor (Step 2) |
| Orders not reaching dashboard | Check Supabase Realtime is enabled (automatic after schema.sql) |
| Build errors | Delete `.next` folder and run `pnpm install` again |

---

## Local-Only Mode

If you skip Supabase setup (no `.env.local`), the app runs in local demo mode:
- Data is stored in `localStorage` only
- No cross-device sync
- No image uploads
- Uses hardcoded demo credentials from the login page

This is useful for development or demo purposes.
