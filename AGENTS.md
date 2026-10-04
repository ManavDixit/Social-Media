# AGENTS.md — Social-Media (MERN Stack)

## Project Structure
```
Social-Media/
├── backend/          # Express + MongoDB + Socket.io
│   ├── index.js      # Entry point (HTTP + WS server)
│   ├── db.js         # MongoDB connection
│   ├── models/       # Mongoose schemas: Auth, Post, Messages, Comment
│   ├── controllers/  # Route handlers
│   ├── routes/       # Express routers
│   ├── middleware/   # auth, uploads, pagination, Posts
│   └── socket/       # Socket.io setup + message controller
├── frontend/         # React + Vite + Redux Toolkit
│   ├── src/
│   │   ├── components/   # UI components (Home, Profile, Messages, etc.)
│   │   ├── Reducers/     # Redux slices
│   │   ├── socket.js     # Socket.io client
│   │   ├── App.jsx       # Routes + providers
│   │   └── main.jsx      # Entry
│   └── vite.config.js
```

## Quick Start
```bash
# Backend
cd backend
npm install
# Create .env (see Environment Variables below)
npm run dev   # uses nodemon (watch: ./, ext: js,json)

# Frontend (separate terminal)
cd frontend
npm install
npm run dev   # Vite on 0.0.0.0, allowedHosts includes manavsocial.loca.lt
```

## Environment Variables (Required)
**Backend `.env`**:
```
PORT=8000
DB_URL=mongodb://...          # MongoDB connection string
JWT_SECRET_KEY=...            # HS256 secret
FRONTEND_URL=http://localhost:5173  # For CORS + email links
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URL=...
# Email (nodemailer)
EMAIL_USER=...
EMAIL_PASS=...
```

**Frontend**: Uses `import.meta.env.VITE_*` if needed; currently none required.

## Key Commands
| Task | Command |
|------|---------|
| Backend dev (watch) | `cd backend && npm run dev` |
| Backend prod | `cd backend && npm start` |
| Frontend dev | `cd frontend && npm run dev` |
| Frontend build | `cd frontend && npm run build` |
| Frontend preview | `cd frontend && npm run preview` |
| Lint (both) | `npm run lint` (eslint in each package) |

**No test suite exists** — `npm test` exits with error in both packages.

## Architecture Notes
- **Backend**: Single Express app + HTTP server upgraded for Socket.io. Routes mounted at `/posts`, `/auth`, `/profile`, `/message`.
- **Auth**: JWT (HS256) in `token` header or query. Middleware `authenticate` verifies and attaches `req.email`.
- **WebSocket**: Socket.io auth via same JWT in `socket.handshake.auth.token`. Connected sockets join room named by user email.
- **Media**: Cloudinary signed uploads (images/videos). Backend middleware `signuploadform` returns signature + timestamp.
- **Pagination**: Cursor-based (time-based) for messages and posts.
- **Frontend**: Vite + React 18 + Redux Toolkit. Routes in `App.jsx`. Socket connection managed in `App` effect (connects on token presence).
- **Redux slices**: posts, alert, postInfo, profile, messages.

## Gotchas
1. **Backend `package.json` has no `dev` script** — README says `npm run dev` but only `start` exists. Use `nodemon index.js` directly or add script.
2. **Frontend `package.json` name is `"backend2"`** — likely copy-paste artifact.
3. **No `.env.example`** — infer from code (`db.js`, `index.js`, `Auth.js`, `uploads.js`, `email.js`).
4. **Cloudinary folder structure**: `uploads/images/`, `uploads/videos/` — hardcoded in `uploads.js`.
5. **Socket auth reuses Express middleware** by mocking `req`/`res` — fragile if middleware changes.
5. **Frontend `allowedHosts`** includes `manavsocial.loca.lt` for tunnel testing; remove/change for other tunnels.
6. **Video upload/playback uses streaming** (multer + range requests) — see `Posts.js` middleware and controller.
7. **No TypeScript** — JS only, `jsconfig.json` in backend for path aliases.

## File References for Deep Dives
- Auth flow: `backend/controllers/Auth.js` (signup → email → verify → signin, Google OAuth)
- Post media: `backend/middleware/Posts.js`, `backend/controllers/Posts.js`
- Messaging: `backend/socket/controllers/Messages.js`, `frontend/src/components/Messages/`
- Profile/follow: `backend/routes/Profile.js`, `backend/controllers/Profile.js`
- Frontend API calls: `frontend/src/api/` (Profile.js, Posts.js, etc.)