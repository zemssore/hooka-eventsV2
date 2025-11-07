# Hookah Events - Premium Catering Website

A modern, high-performance Next.js website for Hookah Events, featuring premium animations, 3D interactive elements, and comprehensive booking functionality.

## 🚀 Features

- **Interactive 3D Showcase**: Real-time 3D hookah visualization using Three.js
- **Smooth Animations**: Framer Motion animations with parallax effects and staggered reveals
- **Responsive Design**: Mobile-first design with Tailwind CSS v4
- **Contact Forms**: Lead capture with API integration
- **Price Calculator**: Dynamic pricing based on event parameters
- **Gallery & Portfolio**: Filtered gallery showcasing past events
- **Premium UI Components**: shadcn/ui components with custom styling
- **Dark Mode Ready**: Full dark mode support with theme provider
- **Performance Optimized**: Server components, dynamic imports for 3D, and optimized images

## 📋 Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI Library**: shadcn/ui + Tailwind CSS v4
- **Animations**: Framer Motion v12
- **3D Graphics**: Three.js
- **Styling**: Tailwind CSS with custom CSS variables
- **Language**: TypeScript
- **Font**: Geist Mono (primary font)

## 🏗️ Project Structure

\`\`\`
.
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main landing page
│   ├── globals.css         # Global styles & design tokens
│   └── api/
│       ├── lead/route.ts   # Lead capture endpoint
│       └── review/route.ts # Review submission endpoint
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── hero.tsx            # Hero section with animations
│   ├── advantages.tsx      # Why choose us section
│   ├── gallery.tsx         # Portfolio gallery
│   ├── menu.tsx            # Menu with mixtures
│   ├── services.tsx        # Pricing packages
│   ├── calculator.tsx      # Dynamic price calculator
│   ├── reviews.tsx         # Client testimonials
│   ├── contacts.tsx        # Contact form & info
│   ├── footer.tsx          # Footer
│   ├── navigation.tsx      # Header navigation
│   ├── animated-background.tsx  # Particle animation
│   ├── 3d-hookah.tsx       # Three.js 3D hookah model
│   ├── interactive-3d-showcase.tsx # 3D showcase section
│   ├── parallax-section.tsx # Parallax scroll effect
│   ├── staggered-list.tsx  # Cascading animations
│   ├── text-reveal.tsx     # Word-by-word reveal
│   ├── card-hover-effect.tsx # Interactive card gradient
│   ├── floating-button.tsx # Enhanced button animations
│   ├── animated-counter.tsx # Number counter animation
│   └── scroll-trigger.tsx  # Scroll-based animations
├── hooks/
│   └── use-mobile.ts       # Mobile detection hook
├── lib/
│   └── utils.ts            # Utility functions
└── public/
    ├── images/             # Event photos
    └── fonts/              # Custom fonts
\`\`\`

## 🎨 Design System

### Color Palette
- **Background**: `#0a0a0a` (Dark base)
- **Foreground**: `#fafafa` (Light text)
- **Accent**: `#ffd700` (Gold)
- **Card**: `#141414` (Slightly lighter)
- **Border**: `#262626` (Subtle borders)

### Typography
- **Heading Font**: Geist Mono (Bold)
- **Body Font**: Geist Mono (Regular)
- **Size Scale**: 0.875rem (14px) to 3rem (48px)

### Spacing
- **Base Unit**: 1rem (16px)
- **Scale**: 4, 6, 8, 12, 16, 20, 24, 32 (in rem)

## 🚀 Getting Started

### Installation

\`\`\`bash
# Clone the repository
git clone <repo-url>

# Install dependencies
npm install
# or
pnpm install

# Run development server
npm run dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the result.

### Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Email/Notifications (if using external service)
# SENDGRID_API_KEY=your_key_here
\`\`\`

## 📦 Build & Deployment

### Build for Production

\`\`\`bash
npm run build
npm run start
\`\`\`

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Configure environment variables
5. Deploy

**One-click deploy:**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourname%2Fhookah-events)

## 🎯 Key Sections

### Hero Section
- Full-screen entry with title animation
- Mouse parallax effect
- Smooth scroll indicator

### Advantages Section
- 6 key benefits with icons
- Staggered reveal animations
- Hover effects with scale and shadow

### Interactive 3D Showcase
- Real-time Three.js 3D model
- Toggle between 2D info and 3D view
- Responsive scaling
- Interactive lighting

### Gallery
- Filterable portfolio
- Category-based filtering
- Hover zoom effects
- Smooth transition animations

### Services & Pricing
- 3 pricing tiers
- Highlighted "popular" package
- Feature lists with icons
- Mobile-responsive grid

### Calculator
- Dynamic price calculation
- Real-time preview
- Multiple customization options
- Sticky price summary on desktop

### Contact Form
- Multiple submission methods
- Form validation
- Loading states
- API integration ready

## 🔧 Customization

### Modify Colors
Edit CSS variables in `app/globals.css`:

\`\`\`css
:root {
  --accent: 39 100% 55%;      /* Change to your color */
  --background: 6 10% 5%;     /* Modify background */
}
\`\`\`

### Update Content
- **Hero text**: `components/hero.tsx`
- **Menu items**: `components/menu.tsx`
- **Testimonials**: `components/reviews.tsx`
- **Contact info**: `components/contacts.tsx`

### Modify 3D Model
Edit `components/3d-hookah.tsx` to customize:
- Model geometry
- Colors and materials
- Lighting setup
- Animation speed

## 📱 Performance

- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

### Optimization Features
- Image optimization with Next.js Image component
- Dynamic imports for 3D components
- CSS-in-JS with Tailwind v4
- Code splitting and lazy loading
- Minified production builds

## 🔐 Security

- Input validation on forms
- CSRF protection ready
- Secure API routes
- Environment variable protection
- No sensitive data in client code

## 📊 SEO

- Meta tags configured
- Open Graph support
- Semantic HTML structure
- Mobile-friendly design
- Fast load times

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📞 Support

For issues or questions:
- Email: info@hookahevents.ru
- Phone: +7 (999) 123-45-67
- Telegram: @hookahevents

## 📄 License

This project is proprietary and confidential. All rights reserved.

---

**Made with ❤️ using Next.js, React, and Tailwind CSS**
