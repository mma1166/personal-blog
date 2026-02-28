# 🚀 Muntasir's Professional Blog Studio

A high-performance, secure, and modern personal blog platform built with the latest **Next.js 16**, **Prisma 6**, and **Vercel Postgres**. This project is designed for professional storytelling with an emphasis on high-quality visuals and rock-solid security.

## ✨ Key Features

- **💎 Premium Aesthetics**: Modern "Glassmorphism" UI with smooth Framer Motion animations.
- **🛡️ Secure Admin Portal**: Professional authentication system using **JWT sessions** (HTTP-only cookies) and **SHA-256 client-side hashing** to protect credentials.
- **☁️ Cloud-Synced Profile**: Admin bio, professional title, and high-quality profile photos are stored in **Vercel Postgres**, ensuring they persist across incognito windows and different devices.
- **🖼️ High-Quality Image Handling**: Direct integration with **Cloudinary** for professional-grade image storage and lightning-fast CDN delivery.
- **📝 Advanced Editor**: Tiptap-powered rich text editor with support for images, YouTube embeds, and custom formatting.
- **⚡ Pro Database Stack**: Built with **Prisma 6** and **Vercel Postgres (Neon)** for type-safe, ultra-fast data access.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Database**: [Vercel Postgres (Neon)](https://vercel.com/storage/postgres)
- **ORM**: [Prisma 6](https://www.prisma.io/)
- **Media Storage**: [Cloudinary](https://cloudinary.com/)
- **Styling**: Vanilla CSS with CSS Modules & Global Variables
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### 1. Environment Variables

Create a `.env` file in the root directory and add the following:

```bash
# Vercel Postgres (Neon)
DATABASE_URL="your-postgres-url"
POSTGRES_PRISMA_URL="your-postgres-url"

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"

# Authentication Security
JWT_SECRET="your-secure-random-string"
```

### 2. Installation

```bash
npm install
```

### 3. Database Setup

```bash
npx prisma generate
npx prisma db push
```

### 4. Running Locally

```bash
npm run dev
```

## 🔒 Security Architecture

This blog uses a **Double-Security** hashing mechanism:
1. **Client-Side**: Passwords are hashed with SHA-256 *before* being sent over the network, hiding them from the browser's Network tab.
2. **Server-Side**: The hash is hashed *again* on the server before being compared or stored in the database.
3. **Session**: Secure, `httpOnly`, `secure`, and `sameSite: lax` cookies handle the admin session.

## 🌐 Deployment

Deployed on **Vercel** with automatic CI/CD.

- **Main Domain**: [muntasiramit.me](https://muntasiramit.me)
- **Blog Subdomain**: [blog.muntasiramit.me](https://blog.muntasiramit.me)

---
*Built with ❤️ by Muntasir Mahmud Amit*
