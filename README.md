# GameCenter

A game discovery app built with React and a Node/Express backend. Browse games sourced from [RAWG.io](https://rawg.io), view rich detail pages with trailers and screenshots, and see live Steam data (player counts, patch notes, and pricing).

## Tech Stack

- **Frontend:** React, Vite, TailwindCSS, React Router, TanStack Query
- **Backend:** Node.js, Express, Prisma ORM
- **Database:** PostgreSQL (Supabase)
- **Data sources:** RAWG API, Steam Store API, Steam Web API

## Features

- Browse and search games with genre filtering and pagination
- Detailed game pages with a media gallery (trailers via hls.js + screenshots)
- Live Steam concurrent player counts
- Latest news / patch notes from Steam
- Steam pricing and "where to buy" links
- System requirements, ratings, and metacritic scores

## Getting Started

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

Create a `backend/.env` file with your `DATABASE_URL`, `RAWG_API_KEY`, and `STEAM_API_KEY`.
