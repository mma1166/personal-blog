# Muntasir's Professional Blog

A premium, high-performance blog website built with Next.js, Framer Motion, and Supabase.

## Features
- 🚀 **Next.js App Router**: Lightning fast performance.
- 🎨 **Rich Aesthetics**: Dark mode, glassmorphism, and fluid animations.
- ✍️ **Advanced Editor**: Tiptap-based rich text editor with drag-and-drop image support and YouTube integration.
- 🛠️ **Admin Portal**: Full control over your blogs (Create, Edit, Delete, Publish/Unpublish).
- 📱 **Responsive**: Perfect experience on mobile, tablet, and desktop.

## Getting Started

### 1. Supabase Setup
1. Create a project at [supabase.com](https://supabase.com).
2. Create a table named `blogs` with the following columns:
   - `id`: `uuid` (Primary Key, Default: `gen_random_uuid()`)
   - `created_at`: `timestamptz` (Default: `now()`)
   - `title`: `text`
   - `slug`: `text` (Unique)
   - `content`: `text` (HTML)
   - `category`: `text`
   - `published`: `boolean` (Default: `false`)
   - `image_url`: `text` (Optional)
3. Copy your **Project URL** and **Anon Key** from Project Settings -> API.

### 2. Environment Variables
Create a `.env.local` file in the root directory and paste your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Locally
```bash
npm install
npm run dev
```

## Deployment
This website is ready to be hosted on **Vercel**. Simply push your code to GitHub and connect it to Vercel. Make sure to add your environment variables in the Vercel dashboard.

---
Designed with ❤️ by Antigravity
