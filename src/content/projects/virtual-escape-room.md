---
slug: virtual-escape-room
title: Virtual Escape Room
description:
  A security-hardened, one-hour virtual escape room for communications
  and marketing students — built with Astro on Cloudflare featuring a backend
  answer checker, session-based cookie validation, rate limiting, and an admin
  panel to track student progress.
status: Active
updateDate: 2026-08-13
keywords:
  - escape-room
  - education
  - gamification
  - backend
  - security
  - rate-limiting
  - administration
  - cloudflare
  - weber-state-university
technologies:
  - astro
  - cloudflare workers
  - cloudflare pages
  - tailwind css
  - typescript
  - cookie-based auth
  - rate limiting
  - admin dashboard
featured: true
websiteLink: https://escape-room.brockadams.com
---

## Project Overview

A virtual one-hour escape room hosted for Professor Brock Adams at Weber State University, used in his communications and marketing courses. Students must solve a sequence of puzzles to escape, while the platform enforces real progress — no skipping ahead, no spamming answers, and no peeking at the solution by reading the page source.

## Business Challenge

Version one of the escape room was a simple chain of static HTML files following links. It worked, but it had fundamental weaknesses in the age of AI:

- **No real security** — Nothing was password protected, cookie validated, or reportable. Students could freely jump ahead between rooms.
- **Client-side answers** — Students had AI chatbots (like Claude) read the HTML and immediately expose the client-side form validation, revealing every answer before solving.
- **No visibility** — There was no way for the professor to see who was stuck, where, or for how long.

The goal was a rebuild that kept the puzzle experience intact while making it genuinely harder to cheat, and giving the professor meaningful analytics.

## Technical Architecture

### Core Framework

- **Astro 7** — Server-rendered application hosted on Cloudflare, replacing the static HTML approach.
- **Cloudflare Workers + Pages** — Edge deployment with built-in CI/CD through the existing `.pages.yml` pipeline.
- **Backend answer checker** — All answer validation now happens server-side, so the correct answers can never be discovered by reading client-side code.
- **TypeScript** — Type-safe configuration and content throughout.

### Security & Anti-Cheat

- **Cookie-based session validation** — Each student's browser is paired with a unique session ID so the server can track exactly who is doing what.
- **Progress-gated rooms** — Cookies are checked server-side to prevent students from jumping ahead to later rooms unless they have solved the required previous steps of the puzzle.
- **Server-side answers** — Frontend validation removed entirely; students must talk to the backend, and AI can no longer read answers out of the HTML.

### Administration & Monitoring

- **Admin panel** — Professor Brock Adams can log in and see at a glance whether someone is getting stuck and how long they have been in each room.
- **Session tracking** — The professor can view how long students have been stuck at each step.
- **Rate limiting** — Guards the input forms so students can't spam the answer fields and brute-force their way through the puzzles.

## User Experience

- **One-hour gameplay** — Designed around a tight, engaging hour-long experience suited to a class session.
- **Progressive puzzles** — Students must genuinely solve each stage, creating authentic problem-solving pressure.
- **Low friction** — Simple, focused puzzle interfaces with minimal distraction so students stay in the game.

## Results & Impact

The rebuilt escape room solves every weakness of the original:

- **Cheat-resistant** — AI reading the source can no longer extract answers, and students can't skip ahead without completing prior steps.
- **Professor visibility** — Real-time insight into which students are stuck and for how long, enabling targeted help.
- **Fair gameplay** — Rate limiting prevents brute-forcing, keeping the experience challenging and fair for students who solve it legitimately.
