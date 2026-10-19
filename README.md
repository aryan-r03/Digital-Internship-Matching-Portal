# KAAMSUTRA // कामसूत्र

> **Production-Grade Full-Stack Manga Platform with Cinematic Editorial Aesthetics**

[![Architecture](https://img.shields.io/badge/Architecture-Monorepo%20Workspaces-E63946?style=flat-square)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square)](#)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express%205-080808?style=flat-square)](#)
[![Database](https://img.shields.io/badge/Database-SQLite%20(Native%20WAL)-E5A93C?style=flat-square)](#)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%206%20%2B%20Tailwind-black?style=flat-square)](#)
[![WCAG](https://img.shields.io/badge/Accessibility-WCAG%202.2%20AA-emerald?style=flat-square)](#)

---

## 1. PROJECT OVERVIEW

**KaamSutra // कामसूत्र** is an editorial manga publishing, reading, and community platform inspired by high-contrast print art direction, Indian & Devanagari typography, and cinematic framing.

Unlike generic anime templates, the application implements an intentional visual design language:
- Predominantly black, charcoal, and off-white surfaces (`#080808`, `#111111`, `#191919`, `#F5F3EF`).
- Halftone screentone dot textures and speed lines accents.
- Hindi editorial typography markers (`मुख्य पृष्ठ`, `लोकप्रिय क्रम`, `नवीन`, `कार्यकक्ष`).
- Restrained vermilion red accent (`#E63946`) for dramatic punctuation.
- Panel-by-panel framing with ink-like borders.

---

## 2. CORE CAPABILITIES & WORKFLOWS

### 📖 1. Cinematic Manga Reader (`/read/:chapterId`)
- **Three Reading Modes**:
  1. **Vertical Strip Mode** (Webtoon format) — continuous vertical panel scrolling with smooth reading flow.
  2. **Single Page Mode** — high-impact cinematic frame with keyboard arrows, progress slider, and fullscreen mode.
  3. **Double Spread Mode** — traditional two-page book spread with RTL/LTR directional toggles.
- **Four Atmospheric Visual Filters**:
  - `Normal Art`: High fidelity color / grayscale original panels.
  - `Noir Ink`: High-contrast grayscale noir simulation.
  - `Screentone FX`: Authentic halftone print dot overlay.
  - `Inverted Night`: Soft white-on-black lines for low-light reading.
- **Interactive Scrubber HUD**: Page jumper, chapter selector, and fullscreen toggle (`F`).
- **Chapter Celebration**: Confetti particle burst upon finishing chapter.
- **Reader Discussions**: Real-time chapter commentary section with timestamped feedback.

### 🔍 2. Catalog & Discovery Archive (`/explore`)
- Instant debounced search with live keyword filtering across title, regional Hindi title, author, artist, and synopsis.
- Multi-dimensional taxonomy filters:
  - **Genre**: Dark Fantasy, Cyberpunk, Supernatural, Action, Psychological, Historical, Mecha, Romance, Mystery, etc.
  - **Demographic**: Shonen (`युवा`), Seinen (`वयस्क`), Shojo (`किशोरी`), Josei (`महिला`).
  - **Status**: Ongoing (`जारी`) vs Completed (`पूर्ण`).
  - **Sort**: Trending Hits, Highest Rated, Recently Published, Alphabetical (A-Z).
- Screentone skeleton loading states and manga-framed empty states.

### 📚 3. Personal Library Vault (`/library`)
- Categorized user reading shelves: **Currently Reading**, **Plan to Read**, **Completed**, and **Dropped**.
- Auto-bookmarking and progress tracking: remembers last read chapter and provides instant **"Resume"** shortcuts.

### 🖋️ 4. Creator Publishing Studio (`/studio`)
- Authoring workbench for manga creators and curators:
  - **Publish New Series**: Upload title, Japanese calligraphy title, cover art URL, banner URL, synopsis, demographic, and multi-genre tags.
  - **Publish Chapter**: Select series, enter chapter number and title, supply sequential panel image URLs with automatic indexing.
  - **Series Management**: Table view of creator serializations with live view metrics, chapter counters, and deletion controls.

### ⭐ 5. Community Critiques & Reviews
- Multi-criteria rating evaluation:
  - **Story Pacing & Narrative** (1–5 Stars)
  - **Art Direction & Screentones** (1–5 Stars)
  - **Character Development** (1–5 Stars)
- Automated atomic recalculation of series average score and review counts in SQLite transactions.
- Review like counters.

### 📊 6. Reader Dossier & Platform Analytics (`/profile`)
- Personal reading log with chronological timeline of completed chapters.
- Library shelf breakdown graph.
- Editable user bio, avatar, and account statistics.

---

## 3. DEMO ACCOUNTS & QUICK SWITCHER

The application includes an **Instant One-Click Demo Profile Switcher** located in the top navigation bar and authentication forms. No manual password typing is required to evaluate different roles:

| Role | Username | Email | Password | Privileges |
| :--- | :--- | :--- | :--- | :--- |
| **Reader** | `YukiReader` | `yuki@nextgenmanga.io` | `password123` | Bookmarks, Reading History, Chapter Comments, Reviews |
| **Creator** | `KenshiArtisan` | `kenshi@nextgenmanga.io` | `password123` | Full Publishing Studio, Add Chapters, Edit/Delete Series |
| **Admin** | `MangaEditor` | `admin@nextgenmanga.io` | `password123` | System-wide Curator, Feature Series, Moderate Content |

---

## 4. ARCHITECTURE & REPOSITORY STRUCTURE

```
Next_Gen_Final/
├── package.json               # Root monorepo scripts (dev, build, test, seed)
├── tsconfig.json              # Root TypeScript config
├── .env.example               # Environment variables template
├── README.md                  # Comprehensive documentation
│
├── server/                    # Backend API (Express 5 + TypeScript + SQLite)
│   ├── src/
│   │   ├── config/env.ts      # Environment validation
│   │   ├── db/
│   │   │   ├── index.ts       # Native Node 24 SQLite connection & WAL mode
│   │   │   └── seed.ts        # Idempotent realistic seed script
│   │   ├── middleware/
│   │   │   ├── auth.ts        # JWT token generation, verification & RBAC
│   │   │   └── validate.ts    # Zod request validation & error handler
│   │   ├── routes/
│   │   │   ├── auth.ts        # /api/v1/auth (register, login, me, profile)
│   │   │   ├── manga.ts       # /api/v1/manga (list, featured, slug, CRUD)
│   │   │   ├── chapters.ts    # /api/v1/chapters (pages, comments)
│   │   │   ├── bookmarks.ts   # /api/v1/bookmarks (library management)
│   │   │   ├── reviews.ts     # /api/v1/reviews (multi-criteria critiques)
│   │   │   └── stats.ts       # /api/v1/stats (platform & user metrics)
│   │   ├── services/          # Authoritative domain business logic
│   │   ├── types/index.ts     # Shared server TypeScript types
│   │   ├── app.ts             # Express app setup & production static serving
│   │   └── index.ts           # Server entry point & graceful shutdown
│   ├── tests/api.test.ts      # 17 automated integration tests with supertest
│   └── tsconfig.json
│
└── client/                    # Frontend SPA (React 18 + Vite 6 + Tailwind CSS)
    ├── src/
    │   ├── api/index.ts       # Typed fetch API client with error handling
    │   ├── context/
    │   │   ├── AuthContext.tsx               # Auth state & demo account switch
    │   │   └── ReaderPreferencesContext.tsx  # Reader mode & filter presets
    │   ├── components/
    │   │   ├── layout/ (Navbar, Footer)
    │   │   ├── ui/ (Button, Badge, Modal, ScreentonePanel, SpeedLineBanner)
    │   │   ├── manga/ (MangaCard, MangaGrid, BookmarkModal, ReviewModal)
    │   │   └── reader/ (CinematicReader)
    │   ├── pages/
    │   │   ├── Home.tsx, Explore.tsx, MangaDetail.tsx, ReaderPage.tsx
    │   │   ├── Library.tsx, Studio.tsx, Profile.tsx
    │   │   └── Login.tsx, Register.tsx, NotFound.tsx
    │   ├── types/index.ts
    │   ├── index.css          # Manga custom scrollbars & reduced motion
    │   ├── App.tsx            # React router with layout management
    │   └── main.tsx
    ├── tailwind.config.js     # Manga color tokens, shadows & screentone gradients
    └── vite.config.ts         # Proxy configuration and build options
```

---

## 5. DATABASE SCHEMA & DATA INTEGRITY

The database utilizes **Node.js 24 native SQLite (`node:sqlite`)** with `PRAGMA journal_mode = WAL;` and `PRAGMA foreign_keys = ON;`.

### Tables:
1. `users`: Credentials (`password_hash` via bcryptjs), role (`reader`, `creator`, `admin`), avatar, bio.
2. `manga`: Titles (English & Japanese), unique slug, author, artist, demographic, status, genres (JSON array), views count, rating aggregates.
3. `chapters`: Foreign key to `manga(id)` on delete cascade, chapter number, title, release date, panel pages JSON array.
4. `bookmarks`: Unique compound key `(user_id, manga_id)`, status (`reading`, `plan_to_read`, `completed`, `dropped`), last read chapter reference.
5. `reviews`: Unique compound key `(user_id, manga_id)`, individual story/art/character ratings, overall rating, review title and commentary.
6. `chapter_comments`: Foreign key to `chapters(id)` and `users(id)`, user reactions and discussions.
7. `reading_history`: User chapter completion timestamp and progress for user analytics.

---

## 6. REST API SPECIFICATION (`/api/v1`)

| Method | Endpoint | Auth | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Public | System health check |
| `POST` | `/api/v1/auth/register` | Public | Register new user account |
| `POST` | `/api/v1/auth/login` | Public | Login with credentials or demo user |
| `GET` | `/api/v1/auth/me` | Bearer | Retrieve authenticated profile & stats |
| `PATCH` | `/api/v1/auth/profile` | Bearer | Update user bio or avatar |
| `GET` | `/api/v1/manga` | Public | Paginated catalog list with search/filter/sort |
| `GET` | `/api/v1/manga/featured` | Public | Curated landing showcase series |
| `GET` | `/api/v1/manga/:slug` | Optional | Series details, chapters list, user bookmark status |
| `POST` | `/api/v1/manga` | Creator/Admin | Publish a new manga series |
| `PUT` | `/api/v1/manga/:id` | Creator/Admin | Update manga metadata |
| `DELETE` | `/api/v1/manga/:id` | Creator/Admin | Remove manga series |
| `GET` | `/api/v1/chapters/:id` | Optional | Chapter pages, prev/next links & mark read history |
| `POST` | `/api/v1/chapters` | Creator/Admin | Upload new chapter panels |
| `GET` | `/api/v1/chapters/:id/comments` | Public | Retrieve chapter comments |
| `POST` | `/api/v1/chapters/:id/comments` | Bearer | Post chapter reaction |
| `GET` | `/api/v1/bookmarks` | Bearer | Retrieve user library |
| `POST` | `/api/v1/bookmarks` | Bearer | Set reading status (reading, completed, etc.) |
| `DELETE` | `/api/v1/bookmarks/:mangaId` | Bearer | Remove series from library |
| `GET` | `/api/v1/reviews/:mangaId` | Public | List reviews with multi-criteria scores |
| `POST` | `/api/v1/reviews/:mangaId` | Bearer | Submit/update review & update average |
| `POST` | `/api/v1/reviews/:id/like` | Public | Like an editorial critique |
| `GET` | `/api/v1/stats` | Public | Platform-wide volume metrics |
| `GET` | `/api/v1/stats/me` | Bearer | User reading history and shelf distribution |

---

## 7. GETTING STARTED & LOCAL RUNTIME

### Prerequisites
- **Node.js**: v22.0.0+ or v24.0.0+ (Node 24 recommended for native SQLite)
- **npm**: v10.0.0+

### Installation & Database Initialization

```bash
# 1. Install all dependencies across both workspaces
npm install

# 2. Seed the database with high-resolution manga series, chapters, and demo users
npm run seed
```

### Starting the Application in Development Mode

```bash
# Starts both the backend API (Port 5001) and Vite frontend (Port 5173) concurrently:
npm run dev
```

Open your browser to **`http://localhost:5173`**.

---

## 8. AUTOMATED TESTING & BUILD VALIDATION

### Run Automated Tests

```bash
# Run backend integration tests (17 API tests)
npm run test:server

# Run frontend tests
npm run test:client

# Run both test suites
npm run test
```

### Production Build

```bash
# Compiles server TypeScript and creates optimized Vite production bundle:
npm run build

# Start the standalone unified production server:
npm start
```

---

## 9. ACCESSIBILITY & PRODUCTION HARDENING

- **WCAG 2.2 AA Compliance**: Semantic HTML5 elements (`<header>`, `<main>`, `<footer>`, `<dialog>`), explicit heading hierarchies, visible focus rings, and high text contrast ratios.
- **Motion Reduction**: `prefers-reduced-motion` media queries disable non-essential animations.
- **Security Boundary**: Bcrypt password hashing, signed JWT authentication tokens, Zod schema validation on all POST/PUT routes, CORS origin allowlisting, and parameter isolation preventing SQL injection.
