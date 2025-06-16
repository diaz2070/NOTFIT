# NOTFIT – Workout Logging Web Application

**NOTFIT** is a personal workout logging web application designed for gym users who want to track their training sessions without relying on spreadsheets or notebooks. The platform provides a centralized and intuitive interface for creating routines, logging exercises, and reviewing training history. The system is built with simplicity, usability, and code quality in mind.

## Tech Stack

- **Frontend Framework**: [Next.js](https://nextjs.org/) (React + SSR/CSR hybrid)
- **Programming Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Library**: shadcn/ui (Radix UI)
- **Authentication & Database**: Supabase (PostgreSQL, Auth)
- **ORM**: Prisma ORM
- **Version Control**: Git + GitHub
- **CI/CD & Analysis Tools**:
  - GitHub Actions
  - ESLint + Prettier
  - Husky (pre-commit hooks)
  - SonarCloud (static code analysis)
  - Jest (unit & integration testing)
  - Lighthouse (performance & accessibility audit)

## Features

- **User Authentication** – Register, log in, and manage your profile securely with Supabase Auth.
- **Workout Routines** – Create and manage personalized routines by assigning exercises to specific days.
- **Exercise Management** – Browse a predefined list of exercises categorized by muscle groups.
- **Workout Logging** – Start, pause, resume, and complete workout sessions with tracked metrics.
- **Training History** – Access past workout logs and review recorded weights, reps, and notes.
- **Dark Mode** – Supports dark and light themes with dynamic Tailwind configuration.
- **Responsive Design** – Fully optimized for desktop and mobile experiences trough theme system functionality.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/diaz2070/NOTFIT.git
cd NOTFIT
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

> Ensure that your `.env` file includes a valid `DATABASE_URL` pointing to your Supabase PostgreSQL instance.

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Additional Scripts

- `npm run lint`: Run ESLint to check code style.
- `npm run format`: Format code with Prettier.
- `npm run test`: Run unit tests via Jest.
- `npm run build`: Build the app for production.

---

## Authors

This project was developed by students as part of the *Software Quality* course (CI-0140) at the University of Costa Rica.
