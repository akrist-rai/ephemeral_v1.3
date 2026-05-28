# Production & Deployment Guide

## Vercel Deployment

This project is configured for automated deployment on Vercel.

### 1. Manual Steps on Vercel Dashboard
Before the application can run correctly on Vercel, you must:
1.  **Create a new Project** on Vercel and import your repository.
2.  **Environment Variables:** Add the following environment variable in the Project Settings:
    -   `DATABASE_URL`: Your Neon Postgres connection string (copy from `.env`).
3.  **Deployment:** Once the environment variable is added, Vercel will automatically build and deploy the application.

### 2. CI/CD Workflow
-   **GitHub Actions:** Every push to `main` and every Pull Request triggers a build check (via `.github/workflows/ci.yml`).
-   **Continuous Deployment:** Vercel automatically deploys every successful push to `main` and creates preview environments for Pull Requests.

### 3. Database Management
-   Migrations and schema updates should be handled via `bun run db:push` from your local environment while connected to the production database via `DATABASE_URL`.

## Project Structure (Production)
-   `api/index.ts`: The serverless entrypoint for Vercel.
-   `src/server.ts`: The core Koa application logic (exported for serverless use).
-   `dist/`: The directory where the frontend is built.
-   `vercel.json`: Handles routing between the static frontend and the serverless backend.
