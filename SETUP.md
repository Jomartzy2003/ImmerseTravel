# 🚀 Setup Guide - Immersive Travel Application

Complete step-by-step guide to get your immersive travel application running locally and deployed to production.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **npm**, **yarn**, or **pnpm** package manager
- **Git** for version control
- A **Supabase** account ([Sign up free](https://supabase.com))
- (Optional) **Google Cloud** account for OAuth

## 🔧 Local Development Setup

### Step 1: Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

This will install all required packages:
- React & React DOM
- Supabase client & auth helpers
- GSAP & ScrollTrigger
- Lenis smooth scroll
- Framer Motion
- Tailwind CSS
- TypeScript & Vite

### Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: immersive-travel (or your choice)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is perfect for development
4. Click **"Create new project"** and wait ~2 minutes for setup

### Step 3: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Get your Supabase credentials:
   - In Supabase dashboard, go to **Settings > API**
   - Copy **Project URL** and **anon public** key

3. Edit `.env` file:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4: Initialize Database

1. In Supabase dashboard, navigate to **SQL Editor**
2. Click **"New query"**
3. Open `supabase/schema.sql` from this project
4. Copy the entire contents and paste into the SQL editor
5. Click **"Run"** or press `Ctrl/Cmd + Enter`

This creates:
- ✅ `profiles` table with RLS policies
- ✅ `destinations` table with sample data
- ✅ `user_saves` junction table
- ✅ Automatic triggers for profile creation
- ✅ Indexes for optimal performance
- ✅ 4 sample destinations to get started

6. Verify tables were created:
   - Go to **Table Editor**
   - You should see `profiles`, `destinations`, and `user_saves`
   - Click `destinations` to see the 4 sample entries

### Step 5: Configure Authentication

#### Enable Email/Password Auth (Default)

Email authentication is enabled by default in Supabase. No additional configuration needed!

#### Enable Google OAuth (Optional)

1. **Get Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Navigate to **APIs & Services > Credentials**
   - Click **"Create Credentials" > "OAuth client ID"**
   - Choose **"Web application"**
   - Add authorized redirect URI:
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
   - Copy **Client ID** and **Client Secret**

2. **Configure in Supabase:**
   - In Supabase dashboard, go to **Authentication > Providers**
   - Find **Google** and toggle it on
   - Paste your **Client ID** and **Client Secret**
   - Click **"Save"**

3. **Test the integration:**
   - Start your dev server (next step)
   - Click "Sign In" and try "Continue with Google"

### Step 6: Start Development Server

```bash
npm run dev
```

Your app will be available at: **http://localhost:5173**

You should see:
- ✅ Navigation bar with glassmorphic styling
- ✅ Hero section with parallax effect
- ✅ Grid of 4 sample destinations
- ✅ Smooth scrolling (Lenis)
- ✅ Cinematic grain overlay

### Step 7: Test Authentication

1. Click **"Sign In"** in the navigation
2. Try signing up with email/password
3. Check your email for confirmation link
4. Click the link to verify your account
5. Sign in and test the "Save" functionality
6. Navigate to **"Saved Adventures"** to see your bookmarks

## 🎨 Customization

### Adding Your Own Destinations

#### Method 1: Via Supabase Dashboard

1. Go to **Table Editor > destinations**
2. Click **"Insert row"**
3. Fill in the fields:
   - **title**: "Serengeti Safari"
   - **bg_layer_url**: Background image URL
   - **fg_layer_url**: Foreground cutout URL
   - **description**: Travel description
   - **location**: "Serengeti National Park"
   - **country**: "Tanzania"
   - **category**: "wilderness"
   - **featured**: true/false
4. Click **"Save"**

#### Method 2: Via SQL

```sql
INSERT INTO destinations (
  title, bg_layer_url, fg_layer_url, description,
  location, country, category, featured
) VALUES (
  'Serengeti Safari',
  'https://images.unsplash.com/photo-1516426122078-c23e76319801',
  'https://images.unsplash.com/photo-1564760055775-d63b17a55c44',
  'Witness the great migration and experience Africa''s untamed wilderness.',
  'Serengeti National Park',
  'Tanzania',
  'wilderness',
  true
);
```

### Image Requirements

For best parallax effect:

**Background Layer (`bg_layer_url`):**
- Resolution: 1920x1080px minimum
- Format: JPG or WebP
- Orientation: Landscape
- Content: Wide landscape shots work best
- Size: Compress to <500KB

**Foreground Layer (`fg_layer_url`):**
- Resolution: 1920x1080px minimum
- Format: PNG or WebP with transparency
- Content: Elements that should appear in front (trees, rocks, buildings)
- Position: Bottom-aligned elements work best
- Size: Compress to <300KB

**Image Sources:**
- [Unsplash](https://unsplash.com) - Free high-quality photos
- [Pexels](https://pexels.com) - Free stock photos
- [Pixabay](https://pixabay.com) - Free images

### Customizing Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  charcoal: '#121212',        // Background
  'forest-mist': '#A3B18A',   // Accent/CTA
  'champagne-cream': '#F2E9E4', // Text
  // Add your own:
  'custom-blue': '#3B82F6',
}
```

### Customizing Fonts

Edit `index.html` to add new Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap" rel="stylesheet">
```

Then update `tailwind.config.js`:

```javascript
fontFamily: {
  'custom': ['"Your Font"', 'sans-serif'],
}
```

## 🚢 Production Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Build and deploy:**
```bash
npm run build
vercel
```

3. **Set environment variables:**
   - Go to your project in Vercel dashboard
   - Navigate to **Settings > Environment Variables**
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **Redeploy:**
```bash
vercel --prod
```

### Deploy to Netlify

1. **Build the project:**
```bash
npm run build
```

2. **Deploy:**
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

3. **Set environment variables:**
   - Go to **Site settings > Environment variables**
   - Add your Supabase credentials

### Deploy to GitHub Pages

1. **Install gh-pages:**
```bash
npm install -D gh-pages
```

2. **Add to `package.json`:**
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/immersive-travel"
}
```

3. **Update `vite.config.ts`:**
```typescript
export default defineConfig({
  base: '/immersive-travel/',
  // ... rest of config
})
```

4. **Deploy:**
```bash
npm run deploy
```

### Update Google OAuth for Production

After deploying, update your Google OAuth settings:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your OAuth client
3. Add production redirect URI:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
4. Add your production domain to authorized origins:
   ```
   https://your-domain.com
   ```

## 🔒 Security Checklist

Before going to production:

- [ ] Environment variables are set in hosting platform (not in code)
- [ ] `.env` file is in `.gitignore`
- [ ] Supabase RLS policies are enabled on all tables
- [ ] Google OAuth redirect URIs are configured for production
- [ ] Database password is strong and secure
- [ ] Supabase project has appropriate rate limiting
- [ ] CORS is configured in Supabase if needed

## 🐛 Troubleshooting

### "Missing Supabase environment variables"

**Solution:**
- Ensure `.env` file exists in project root
- Check variable names match exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after creating/editing `.env`

### Google OAuth redirect error

**Solution:**
- Verify redirect URI in Google Cloud Console matches:
  `https://your-project-id.supabase.co/auth/v1/callback`
- Check Google provider is enabled in Supabase
- Ensure Client ID and Secret are correct

### Parallax not working smoothly

**Solution:**
- Enable hardware acceleration in browser
- Check browser console for GSAP errors
- Try reducing Lenis `duration` in `src/hooks/useLenis.ts`
- Test in Chrome (best GSAP performance)

### "Row Level Security policy violation"

**Solution:**
- Ensure user is authenticated before accessing protected data
- Check Supabase logs: **Authentication > Logs**
- Verify RLS policies in **Database > Policies**
- Make sure `schema.sql` was run completely

### Images not loading

**Solution:**
- Check image URLs are publicly accessible
- Verify CORS headers if using custom image host
- Use Unsplash or Supabase Storage for reliable hosting
- Check browser console for 404 errors

### Build fails with TypeScript errors

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript version
npm list typescript

# Rebuild
npm run build
```

## 📊 Performance Optimization

### Image Optimization

1. **Use WebP format:**
```bash
# Convert images to WebP
npm install -g sharp-cli
sharp -i input.jpg -o output.webp
```

2. **Compress images:**
   - Use [TinyPNG](https://tinypng.com/)
   - Or [Squoosh](https://squoosh.app/)
   - Target: <500KB for backgrounds, <300KB for foregrounds

3. **Use Supabase Storage:**
```typescript
// Upload to Supabase Storage
const { data, error } = await supabase.storage
  .from('destinations')
  .upload('bg-image.webp', file)

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('destinations')
  .getPublicUrl('bg-image.webp')
```

### Code Splitting

Already configured! Vite automatically splits:
- Route-based chunks (HomePage, SavedPage, etc.)
- Vendor chunks (React, GSAP, etc.)
- Dynamic imports

### Lighthouse Score Tips

- ✅ Images are lazy-loaded by default
- ✅ Fonts are preloaded in `index.html`
- ✅ CSS is minified in production
- ✅ JavaScript is code-split
- ✅ Accessibility features included

Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

## 📚 Next Steps

Now that your app is running:

1. **Add more destinations** via Supabase dashboard
2. **Customize the color palette** in `tailwind.config.js`
3. **Add your own branding** (logo, fonts, copy)
4. **Set up analytics** (Google Analytics, Plausible, etc.)
5. **Configure custom domain** in your hosting platform
6. **Add more features:**
   - Search and filtering
   - User profiles
   - Comments and reviews
   - Social sharing
   - Email notifications

## 🆘 Getting Help

- **Documentation**: See `README.md` for detailed info
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **GSAP Docs**: [greensock.com/docs](https://greensock.com/docs/)
- **GitHub Issues**: Report bugs in your repository

---

**Happy building! 🚀**
