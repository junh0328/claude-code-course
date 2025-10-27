# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application using the App Router architecture, bootstrapped with `create-next-app`. The project uses modern tooling including Turbopack for faster builds, Biome for linting and formatting, and Tailwind CSS v4 for styling.

## Development Commands

### Start Development Server
```bash
npm run dev
```
Starts the Next.js development server with Turbopack enabled on http://localhost:3000

### Build for Production
```bash
npm run build
```
Creates an optimized production build using Turbopack

### Start Production Server
```bash
npm run start
```
Starts the production server (requires `npm run build` first)

### Linting and Formatting
```bash
npm run lint       # Check code with Biome
npm run format     # Format code with Biome (auto-fixes)
```

## Project Structure

```
src/
  app/              # Next.js App Router directory
    layout.tsx      # Root layout with font configuration
    page.tsx        # Home page component
    globals.css     # Global Tailwind styles
public/             # Static assets (images, icons)
```

## Technology Stack

- **Framework**: Next.js 15.5.6 with App Router
- **React**: 19.1.0
- **TypeScript**: Strict mode enabled
- **Styling**: Tailwind CSS v4 with PostCSS
- **Build Tool**: Turbopack (Next.js native)
- **Linter/Formatter**: Biome 2.2.0
- **Fonts**: Geist and Geist Mono (loaded via next/font)

## TypeScript Configuration

- Path alias `@/*` maps to `./src/*`
- Target: ES2017
- Strict mode enabled
- Module resolution: bundler

## Biome Configuration

- 2-space indentation
- Auto-organize imports enabled
- React and Next.js recommended rules enabled
- Git integration with VCS ignore file support
- Ignores: node_modules, .next, dist, build

## Architecture Notes

### App Router Structure
This project uses Next.js App Router (not Pages Router). Components in `src/app/` define routes:
- `layout.tsx` wraps all pages and configures fonts and metadata
- `page.tsx` files define route pages
- All components are Server Components by default (add `"use client"` directive for client components)

### Styling Approach
- Tailwind CSS v4 is configured via PostCSS (@tailwindcss/postcss)
- Global styles in `src/app/globals.css`
- Utility-first approach with dark mode support via `dark:` prefix

### Font Loading
Fonts are loaded using Next.js font optimization with `next/font/google`:
- Geist Sans: `--font-geist-sans` CSS variable
- Geist Mono: `--font-geist-mono` CSS variable
