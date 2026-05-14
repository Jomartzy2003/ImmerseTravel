# 🌍 Immersive Travel Application

A production-ready, high-end travel application featuring sophisticated parallax effects, smooth scrolling, and a complete authentication system. Built with React, GSAP, Tailwind CSS, and Supabase.

## ✨ Features

### 🎨 Visual Excellence
- **Sandwich Parallax Engine**: Three-layer depth effect with GSAP ScrollTrigger
  - Background layer (0.2x velocity)
  - Typography layer (0.6x velocity) 
  - Foreground cutout layer (1.1x velocity)
- **Lenis Smooth Scrolling**: Momentum-based, buttery-smooth scroll experience
- **Cinematic Grain Overlay**: 3% opacity noise texture for film-like aesthetic
- **Glassmorphism UI**: Backdrop-blur effects on all modals and navigation
- **Framer Motion**: Elegant page transitions and animations

### 🔐 Authentication & Security
- **Google OAuth 2.0**: One-click sign-in via Supabase Auth
- **Email/Password Auth**: Traditional authentication option
- **Row Level Security (RLS)**: PostgreSQL policies protect user data
- **JWT-based Sessions**: Secure, token-based authentication
- **Protected Routes**: Saved adventures only accessible when authenticated

### 🗄️ Database Architecture
- **Profiles Table**: Linked to Supabase Auth via UUID
- **Destinations Table**: Complete content library with layered images
- **User Saves Junction Table**: Many-to-many relationship for bookmarks
- **Automatic Triggers**: Profile creation on user signup
- **Optimized Indexes**: Fast queries on frequently accessed data

### 🎯 User Experience
- **Responsive Design**: Mobile-first, works beautifully on all devices
- **Accessible**: WCAG-compliant with keyboard navigation support
- **Performance Optimized**: Code splitting, lazy loading, optimized images
- **SEO Ready**: Semantic HTML and meta tags

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Supabase account ([supabase.com](https://supabase.com))
- Google OAuth credentials (optional, for Google sign-in)

### Installation

1. **Clone and install dependencies**
```bash
npm install
```

2. **Set up Supabase**

Create a new Supabase project at [supabase.com](https://supabase.com), then:

```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Initialize the database**

In your Supabase project dashboard:
- Go to **SQL Editor**
- Copy the contents of `supabase/schema.sql`
- Run the SQL script

This will create:
- All tables (profiles, destinations, user_saves)
- Row Level Security policies
- Indexes for performance
- Triggers for automatic profile creation
- Sample seed data (4 destinations)

4. **Configure Google OAuth (Optional)**

To enable Google sign-in:
- Go to **Authentication > Providers** in Supabase dashboard
- Enable Google provider
- Add your Google OAuth Client ID and Secret
- Set authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`

Get Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/).

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:5173` 🎉

## 📁 Project Structure

```
immersive-travel-app/
├── src/
│   ├── components/          # React components
│   │   ├── Navbar.tsx       # Navigation with auth state
│   │   ├── AuthModal.tsx    # Glassmorphic login modal
│   │   ├── ParallaxHero.tsx # GSAP parallax engine
│   │   └── DestinationCard.tsx
│   ├── pages/               # Route pages
│   │   ├── HomePage.tsx
│   │   ├── SavedPage.tsx
│   │   └── DestinationDetailPage.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts       # Authentication logic
│   │   ├── useDestinations.ts
│   │   └── useLenis.ts      # Smooth scroll setup
│   ├── lib/
│   │   └── supabase.ts      # Supabase client config
│   ├── types/
│   │   └── database.ts      # TypeScript types
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles + grain overlay
├── supabase/
│   └── schema.sql           # Complete database schema
├── index.html
├── package.json
├── tailwind.config.js       # Custom color palette
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Design System

### Color Palette
- **Deep Charcoal**: `#121212` - Primary background
- **Forest Mist**: `#A3B18A` - Accent color, CTAs
- **Champagne Cream**: `#F2E9E4` - Text, UI elements

### Typography
- **Playfair Display**: Serif font for headings and hero text
- **Inter**: Sans-serif for body text and UI

### Components
- **Glass Effect**: `backdrop-blur-[12px]` with semi-transparent backgrounds
- **Buttons**: Primary (Forest Mist) and Glass variants
- **Cards**: Rounded corners, hover effects, smooth transitions

## 🔧 Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS 3.4 |
| **Animation** | GSAP 3.12, Framer Motion 11, Lenis |
| **Backend** | Supabase (PostgreSQL, Auth, Storage) |
| **Auth** | Supabase Auth with Google OAuth 2.0 |
| **Routing** | React Router 6 |
| **Type Safety** | TypeScript 5.3 |

## 📊 Database Schema

### Tables

**profiles**
- `id` (UUID, FK to auth.users)
- `email` (TEXT)
- `full_name` (TEXT)
- `avatar_url` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

**destinations**
- `id` (UUID, PK)
- `title` (TEXT) - Display text for middle layer
- `bg_layer_url` (TEXT) - Background landscape image
- `fg_layer_url` (TEXT) - Foreground cutout PNG/WebP
- `description` (TEXT) - Travel copy
- `location`, `country`, `category` (TEXT)
- `featured` (BOOLEAN)
- `created_at`, `updated_at` (TIMESTAMP)

**user_saves**
- `id` (UUID, PK)
- `user_id` (UUID, FK to profiles)
- `destination_id` (UUID, FK to destinations)
- `created_at` (TIMESTAMP)
- UNIQUE constraint on (user_id, destination_id)

### Row Level Security (RLS)

All tables have RLS enabled with policies:
- **Profiles**: Public read, users can insert/update their own
- **Destinations**: Public read, authenticated users can write
- **User Saves**: Users can only see/modify their own saves

## 🎬 The Parallax Engine

The "Sandwich" parallax effect creates depth through differential scroll velocities:

```typescript
// Layer 1: Background (slowest)
y: window.innerHeight * 0.3  // 0.2x velocity

// Layer 2: Text (medium)
y: window.innerHeight * 0.5  // 0.6x velocity

// Layer 3: Foreground (fastest)
y: window.innerHeight * 0.7  // 1.1x velocity
```

The foreground layer "covers" the bottom of the text, creating the signature "peeking" effect.

## 🔐 Authentication Flow

1. User clicks "Sign In" → AuthModal opens
2. Choose Google OAuth or Email/Password
3. Supabase handles authentication
4. On success, trigger creates profile in `profiles` table
5. JWT stored in localStorage, auto-refresh enabled
6. Protected routes check session via `useAuth` hook

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Environment Variables
Set these in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🧪 Development

### Run Development Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

## 📝 Adding New Destinations

### Via Supabase Dashboard
1. Go to **Table Editor > destinations**
2. Click **Insert row**
3. Fill in:
   - `title`: Display name
   - `bg_layer_url`: Background image URL (landscape)
   - `fg_layer_url`: Foreground cutout URL (transparent PNG/WebP)
   - `description`: Atmospheric travel copy
   - `location`, `country`, `category`
   - `featured`: true/false

### Via SQL
```sql
INSERT INTO destinations (
  title, bg_layer_url, fg_layer_url, description,
  location, country, category, featured
) VALUES (
  'Northern Lights of Norway',
  'https://images.unsplash.com/photo-1...',
  'https://images.unsplash.com/photo-2...',
  'Dance with the aurora borealis...',
  'Tromsø', 'Norway', 'wilderness', true
);
```

## 🎯 Best Practices

### Image Requirements
- **Background Layer**: 1920x1080px minimum, landscape orientation
- **Foreground Layer**: Transparent PNG/WebP, bottom-aligned elements
- **Optimization**: Use WebP format, compress to <500KB
- **CDN**: Use Unsplash, Cloudinary, or Supabase Storage

### Performance
- Images lazy-load automatically
- GSAP animations use `will-change: transform`
- Lenis scroll runs on RAF (requestAnimationFrame)
- Code splitting via React Router

### Accessibility
- All interactive elements keyboard-navigable
- ARIA labels on icon buttons
- Focus visible states
- Reduced motion support via `prefers-reduced-motion`

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Ensure `.env` file exists with correct values
- Restart dev server after changing `.env`

### Google OAuth not working
- Check redirect URI in Google Cloud Console
- Verify Google provider enabled in Supabase
- Ensure OAuth credentials are correct

### Parallax not smooth
- Check browser hardware acceleration is enabled
- Reduce `duration` in Lenis config for slower devices
- Test on different browsers (Chrome recommended)

### RLS policy errors
- Verify user is authenticated
- Check Supabase logs in dashboard
- Ensure policies match your use case

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [GSAP ScrollTrigger](https://greensock.com/scrolltrigger/)
- [Lenis Smooth Scroll](https://github.com/studio-freight/lenis)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Credits

- Design inspiration: Awwwards, Behance
- Images: Unsplash (sample data)
- Icons: Heroicons
- Fonts: Google Fonts

---

**Built with ❤️ for immersive travel experiences**
