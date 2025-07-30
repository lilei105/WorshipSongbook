# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
A worship song management application for church praise teams, built with Next.js 13/14 (App Router) and PostgreSQL via Prisma ORM. The app provides song organization, calendar-based viewing, and collaborative features for worship teams.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS
- **UI Components**: React Calendar, Lucide React icons
- **HTTP Client**: Axios
- **Date Handling**: Day.js
- **Deployment**: Vercel

## Database Schema
- **Song**: id, name, by (artist), note, sheet_url, audio_url, songlist_id
- **Songlist**: id, name, date, relation to songs (one-to-many)

## Development Commands
```bash
# Install dependencies
npm install

# Database setup (first time)
npx prisma migrate dev
npx prisma generate

# Development server (runs on port 4000)
npm run dev

# Production build
npm run build
npm start

# Linting
npm run lint
```

## Key API Endpoints
- `GET /api/getByDate?date=YYYY-MM-DD` - Get songlists for specific date
- `GET /api/getByDateRange?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Get songlists for date range
- `GET /api/getByList?listId=X` - Get songs in specific songlist

## App Structure
```
src/app/
├── page.js              # Landing page with hero section
├── list/page.js         # Song list view for selected songlist
├── calendar/page.js     # Calendar view with collapsible songlists
├── detail/page.js       # Individual song detail view
├── api/                 # API routes (getByDate, getByDateRange, getByList)
├── Headline.js          # Shared header component
└── Footer.js            # Shared footer component
```

## Key Features
- **Calendar View**: Interactive calendar with date highlighting for song availability
- **Song Lists**: Card-based grid layout with hover effects
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Session Storage**: Uses sessionStorage for state management between pages
- **Visual Indicators**: Badges showing song counts on calendar dates

## Environment Setup
Create `.env` file:
```
DATABASE_URL="postgresql://username:password@localhost:5432/worship_songbook"
```

## Common Development Tasks
- Adding new songs: Database entries via Prisma
- Styling updates: Modify Tailwind classes in component files
- Calendar enhancements: Update `calendar/page.js` and `Calendar.css`
- API modifications: Edit files in `src/app/api/` directory