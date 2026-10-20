# MyPortfolio – COMP229 Assignment 2

MERN portfolio: React (Vite) frontend in `client/`, Node/Express REST API in `server/`, MongoDB Atlas via Mongoose, JWT authentication.

```
MyPortfolio/
├── server.js                 # entry point – connects to MongoDB, starts Express on PORT (3000)
├── config/config.js          # reads .env (PORT, MONGODB_URI, JWT_SECRET)
├── server/
│   ├── express.js            # Express app, middleware, routes, error handling
│   ├── models/               # user, contact, project, qualification (Mongoose)
│   ├── controllers/          # CRUD controllers + auth.controller.js (signin/signout/JWT)
│   ├── routes/               # REST routes
│   ├── helpers/dbErrorHandler.js
│   └── seed.js               # creates the collections with sample data
├── client/                   # React frontend (Vite)
└── MyPortfolio.postman_collection.json
```

## Setup

```bash
npm install                 # backend deps (root)
cd client && npm install    # frontend deps
```

Create `.env` in the root (see `.env.example`):

```
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/Portfolio?retryWrites=true&w=majority
JWT_SECRET=<any long random string>
```

Optional: `npm run seed` (from the root) creates the `users`, `contacts`, `projects` and `qualifications`
collections in the **Portfolio** database with sample data. Seeded login: `admin@portfolio.com` / `password123`.

## Running

| Command | Where | What |
|---|---|---|
| `node server.js` | root | backend only → http://localhost:3000 |
| `npm run client` | client | frontend only → http://localhost:5173 |
| `npm run dev` | root or client | **both at once** (concurrently + nodemon) |

In dev, Vite proxies `/api` and `/auth` to `http://localhost:3000`.

## REST API

| Method | URL | Action | Auth |
|---|---|---|---|
| GET | `/` | welcome message | – |
| POST | `/auth/signin` | sign in → returns JWT `token` | – |
| GET | `/auth/signout` | sign out | – |
| GET | `/api/users` | get all users | – |
| POST | `/api/users` | add new user (sign up) | – |
| GET | `/api/users/:id` | get user by id | JWT |
| PUT | `/api/users/:id` | update user by id | JWT, own account |
| DELETE | `/api/users/:id` | remove user by id | JWT, own account |
| DELETE | `/api/users` | remove all users | JWT |
| GET | `/api/contacts`, `/api/contacts/:id` | get all / by id | JWT |
| POST | `/api/contacts` | add new contact (contact form) | – |
| PUT / DELETE | `/api/contacts/:id` | update / remove by id | JWT |
| DELETE | `/api/contacts` | remove all contacts | JWT |
| GET | `/api/projects`, `/api/projects/:id` | get all / by id | – |
| POST | `/api/projects` | add new project | JWT |
| PUT / DELETE | `/api/projects/:id` | update / remove by id | JWT |
| DELETE | `/api/projects` | remove all projects | JWT |
| GET / POST / PUT / DELETE | `/api/qualifications[...]` | same as projects | same as projects |

Protected routes need the header `Authorization: Bearer <token>` (the token comes from `/auth/signin`).
Passwords are never stored in plain text – the user model hashes them into `hashed_password` + `salt`.

## Testing with Postman

Import `MyPortfolio.postman_collection.json`. Run **auth → Sign up**, then **auth → Sign in** – the token and
user id are saved to collection variables automatically and used by all protected requests. Each
"Add new …" request saves the new document's id so the "by id" requests work straight after.

## Production build

`npm run build` (root) builds the client into `client/dist`; `node server.js` then serves the React app
and the API from the same port. If you host the frontend separately, set `VITE_API_URL` to the backend URL
when building the client.
