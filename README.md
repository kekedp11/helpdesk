# HelpDesk — Support Ticket Management System

A full-stack help desk application built with React, TypeScript, Node.js, Express, and MongoDB. Designed to manage support tickets with role-based access for users, agents, and administrators.

## Features

- **Authentication** — Secure login with JWT.
- **Role-Based Access Control** — Separate access for users, support agents, and administrators.
- **Ticket Management** — Create, view, update, and delete support tickets.
- **Agent Dashboard** — View assigned tickets and update their status.
- **Admin Dashboard** — Manage tickets, update ticket details, and assign tickets to agents.
- **Ticket Tracking** — Track ticket status, priority, and category.

## Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- React Router
- Axios

**Backend**
- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

## User Roles

| Role | Access |
|---|---|
| User | Create and manage own support tickets |
| Agent | View assigned tickets and update their status |
| Admin | Manage tickets, edit ticket details, and assign agents |

## Project Structure

```text
helpdesk/
├── client/     # React + TypeScript frontend
└── server/     # Express + TypeScript backend
```

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB database

### 1. Clone the repository

```bash
git clone https://github.com/kekedp11/helpdesk.git
cd helpdesk
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory and configure the environment variables required by the application.

Start the development server:

```bash
npm run dev
```

### 3. Set up the frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL displayed by Vite in your terminal.

## Environment Variables

Configure the required environment variables in `server/.env`. Check the backend configuration for the exact variable names.

**Never commit credentials, JWT secrets, or database connection strings to GitHub.**

## Project Status

Core application features are complete. Deployment configuration and production testing are in progress.

## Author

**Keke Destianas Pradipta**

- GitHub: [@kekedp11](https://github.com/kekedp11)
- Portfolio: [View Portfolio](https://portfolio-v2-rho-five-74.vercel.app/)