# Image Transformation Service — Frontend

React + TypeScript (Vite) web application that allows authenticated users to upload an image, remove its background, flip it horizontally, and manage processed images.

---


<img width="1040" height="614" alt="before-after" src="https://github.com/user-attachments/assets/64091fb4-597a-42a6-95a1-0c53de1508d9" />

---

## Live

Frontend:  
https://image-transform-service-frontend.vercel.app  

Backend API:  
https://image-transform-service-backend.onrender.com  

Health Check:  
https://image-transform-service-backend.onrender.com/health  

---

## Features

- Supabase email/password authentication
- Email verification flow
- Single image upload (JPG / PNG / WebP)
- Background removal + horizontal flip processing
- Real-time loading states and feedback
- Personal image gallery
- Delete with ownership enforcement
- Responsive navigation (desktop + mobile)

---

## Architecture

**Frontend**
- Handles authentication via Supabase
- Retrieves Supabase JWT access token
- Sends authenticated requests to backend
- Manages UI state and user experience

**Backend**
- Validates Supabase JWT
- Processes images (Clipdrop + sharp)
- Stores files in Supabase Storage
- Persists metadata in Postgres
- Enforces ownership

**Auth Flow**
1. User signs in with Supabase.
2. Supabase returns a session with an access token.
3. Frontend attaches: authorization: bearer <access_token> to all backend API requests.
4. Backend validates token before processing.

---

## Tech Stack

- React
- TypeScript
- Vite
- Supabase JS (Auth)
- Fetch API
- Tailwind CSS
- Deployed on Vercel

---

## Environment Variables

Create a local `.env` file (do not commit):

```env
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-public-key>
VITE_API_BASE_URL=https://image-transform-service-backend.onrender.com
```

### Notes

- The anon key is safe for frontend use.
- All privileged operations occur in the backend.

---


## Run Locally
bash
Development (hot-reload)
```
npm install
npm run dev
```
Then Open
```
http://localhost:5173
```

## API Contract
### Endpoints
- POST   /api/images
- GET    /api/images
- DELETE /api/images/:id

---


## Testing
1. Register (verify email).
2. Upload image.
3. Confirm processed result.
4. Verify appears in gallery.
5. Refresh → session persists.
6. Delete → confirm removal.
