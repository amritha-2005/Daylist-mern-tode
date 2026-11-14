# Daylist — MERN To-Do App

Daylist is a simple, accessible to-do list built with MongoDB, Express, React, and Node.js. Create tasks, mark them complete, and remove them.

## Features

- Create, view, complete, and delete tasks
- Persist tasks in MongoDB
- Responsive interface with keyboard and screen-reader accessibility support
- Express REST API with input validation

## Tech stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose

## Requirements

- Node.js and npm
- MongoDB Community Server running locally, or a MongoDB connection URI

## Setup

Open two terminals in this project folder.

### 1. Start MongoDB

Make sure your MongoDB server is running. The default local connection is:

```text
mongodb://127.0.0.1:27017/todo-mern-app
```

### 2. Install and start the backend

```powershell
cd backend
npm install
npm run dev
```

The API runs at `http://localhost:5000`.

### 3. Install and start the frontend

In another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal (by default, `http://localhost:5173`).

## Configuration

The backend reads `PORT` and `MONGODB_URI` from `backend/.env`. The frontend reads `VITE_API_URL` from `frontend/.env`.

Example backend configuration:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/todo-mern-app
```

Example frontend configuration:

```env
VITE_API_URL=http://localhost:5000/api
```

Change these values for your own environment as needed. Do not commit credentials or secrets.

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Check API health |
| `GET` | `/api/todos` | Get all tasks |
| `POST` | `/api/todos` | Create a task with `{ "text": "..." }` |
| `PUT` | `/api/todos/:id` | Update a task's `text` or `completed` value |
| `DELETE` | `/api/todos/:id` | Delete a task |

## Production build

To build the frontend for production:

```powershell
cd frontend
npm run build
```
