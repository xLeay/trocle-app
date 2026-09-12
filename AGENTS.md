# Repository Guidelines

## Interaction & File Modification Policy

By default, operate in read-only advisory mode.

- Do not modify, create, delete, rename, or move files unless I explicitly ask you to do so.
- Do not apply patches automatically.
- Do not run commands that modify the project, dependencies, database, or Git state unless I explicitly ask.
- You may freely read and analyze files and run non-destructive commands when needed.
- When I ask for a code change, explain what needs to change, give the exact file path, and provide the code for me to copy/paste myself.
- If only part of a file needs to change, clearly identify what should be replaced.
- Do not ask for confirmation simply to read or analyze files.

## Project Structure & Module Organization

This repository is an Expo/React Native application written in TypeScript.

- `src/app/` contains Expo Router screens and route layouts.
- `src/components/` contains reusable UI components; feature-specific code belongs in `src/features/`.
- `src/queries/`, `src/state/`, and `src/lib/` contain data fetching, Zustand stores, integrations, and shared hooks/utilities.
- `src/styles/` contains design tokens, themes, and shared styles; `src/types/` contains shared TypeScript types.
- `src/mock/` and `src/data/` contain development fixtures and static data.
- `assets/` contains logos, icons, fonts, and app imagery.
- `app.config.js`, `eas.json`, and `metro.config.js` contain Expo and build configuration.

## Build, Test, and Development Commands

Install dependencies with `npm install`, then use:

- `npm start` — start the Expo development server.
- `npm run android` — build and launch the Android development app.
- `npm run ios` — build and launch the iOS development app (macOS/Xcode required).
- `npm run web` — run the Expo web target.

No test, lint, or formatting scripts are currently defined in `package.json`. Validate UI and platform behavior on the relevant Expo target before submitting changes.

## Coding Style & Naming Conventions

Use TypeScript with strict, readable types and 2-space indentation. Follow the existing naming patterns: PascalCase for React components, camelCase for variables/functions/hooks, and descriptive suffixes such as `Store`, `Queries`, `Mutations`, and `styles`. Keep shared styling in `src/styles/` and prefer existing theme tokens over hard-coded values. Avoid committing secrets; local environment values belong in `.env` and must not be exposed in source or logs.

## Testing Guidelines

There is no configured automated test suite at present. For changes, manually exercise the affected route and relevant Android, iOS, or web target. If adding tests, place them near the code under test using `*.test.ts` or `*.test.tsx` and add the corresponding npm script.

## Commit & Pull Request Guidelines

Existing commits are short and action-oriented, commonly using prefixes such as `add:`, `done:`, and `ongoing:`. Keep commits focused and describe the user-visible or technical change. Pull requests should explain the scope, list validation performed, link related issues when applicable, and include screenshots or recordings for UI changes. Call out environment or Supabase configuration changes explicitly.

## Security & Configuration

Review `.env` handling before changing Supabase or Expo configuration. Never commit credentials, tokens, or production-only values. Keep generated platform/build output and dependency directories out of commits.
