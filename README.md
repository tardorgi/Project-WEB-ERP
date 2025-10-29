# Project-WEB-ERP

A Lightweight, modular web ERP — a practical starting point for modernizing internal management systems.

# What is this

Project-WEB-ERP is a compact, modular web ERP skeleton containing a separate frontend and backend. It aims to be easy to understand and fast to customize — ideal for learning, prototyping, and as a foundation to evolve into a production-ready system.

This repository contains a frontend SPA and a Node.js backend with straightforward folders so teams (or a solo dev) can iterate quickly.

# Why this repo matters

Minimal, readable codebase — great for onboarding and technical interviews.

Monorepo structure (frontend / backend) that mirrors real-world split between UI and API.

Focused on pragmatic extensibility: add authentication, roles, billing, inventory, or reporting on top without heavy frameworks.

Quick repo snapshot

sistema-web-frontend/ — web client (SPA).

sistema-web-backend/ — API server and business logic.

package.json, main.js — root-level node files.


# Technologies 

JavaScript (frontend + backend)

HTML, CSS

Node.js (NPM)

# Install & run (example)

Commands below assume the usual package.json scripts are present. If a script is missing, fall back to node/npm commands shown.

Clone the repo

git clone https://github.com/tardorgi/Project-WEB-ERP.git
cd Project-WEB-ERP

#Backend

cd sistema-web-backend
npm install 
npm run dev || npm start || node index.js

#Frontend

cd ../sistema-web-frontend
npm install
npm run dev || npm start || serve -s build

Open your browser at http://localhost:3000 (or the ports defined by the apps).

Suggested .env (example)
# BACKEND
PORT=3001
DATABASE_URL=postgres://user:pass@localhost:5432/erp
JWT_SECRET=replace_with_a_strong_secret


# FRONTEND
REACT_APP_API_URL=http://localhost:3001

Adjust the DATABASE_URL for your database engine (Postgres, MySQL, Firebird, etc.).
