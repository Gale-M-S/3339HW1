# CIS 3339 Homework 1 — Student Management

A full-stack student, course, and enrollment manager. The frontend uses Vue 3 Composition API, Vue Router, and Pinia. The Express API stores application data in local MongoDB Community Edition. The original assignment instructions are preserved in [ASSIGNMENT.md](./cis3339-homework1/ASSIGNMENT.md).

## Requirements

- Node.js 20 or newer and npm
- MongoDB Community Edition running on this computer
- A modern web browser

The app does not use MongoDB Atlas or any cloud database.

## Local configuration

The submitted `.env` file is at `cis3339-homework1/.env` and contains:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/cis3339_homework1
PORT=3000
```

This local configuration has no passwords or cloud credentials. On Windows, start the MongoDB service from an elevated terminal with `net start MongoDB` if it is not already running. The application creates the database collections and indexes automatically when the backend starts; no manual database setup or seed command is needed.

## Install and run the production app

Run these commands from the repository folder `3339HW1Z`:

```bash
npm run install:all
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000). Express serves the Vue production build and the REST API. Refreshing a routed page such as `/courses` or `/enrollments` is supported.

## Development

From the repository folder, run:

```bash
npm run dev
```

This starts the API on port `3000` and the Vite frontend on port `5173`. Open [http://localhost:5173](http://localhost:5173); Vite proxies `/api` requests to Express.

## Features

- Add, search, display, and delete students. Student IDs must be unique.
- Add, list, and delete courses. Course IDs must be unique.
- Enroll existing students in existing courses, reject duplicate enrollments, and view course rosters.
- Deleting a student or course also deletes its enrollments.
- Records persist in MongoDB across server restarts.
- Forms display loading, validation, success, and error feedback.

The `node_modules` and build-output folders are excluded from Git. Recreate dependencies with `npm run install:all`.
