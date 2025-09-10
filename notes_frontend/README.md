# Notes Frontend (Vue + Vite)

This is the frontend for a simple Notes app built with Vue 3, Pinia, Vue Router, and Vite. It communicates with a backend over HTTP using a small fetch wrapper. This document explains how to configure the API base URL, the expected backend endpoints, and how to use the app during development.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## 1) Configure VITE_API_BASE_URL (connect frontend to backend)

The HTTP client reads the API base URL from the environment variable VITE_API_BASE_URL (see src/services/http.ts). You must set this variable so that requests are sent to your backend.

- Development: create a .env or .env.development file in the project root (this folder) with:
  ```
  VITE_API_BASE_URL=http://localhost:8080
  ```
  Replace 8080 with the port where your backend runs.

- Preview/Production: set VITE_API_BASE_URL in the environment before building, or create a .env.production file:
  ```
  VITE_API_BASE_URL=https://your-domain.example.com
  ```

Notes:
- The value should be the origin/base, without a trailing slash. The app will append API paths such as /api/notes.
- If VITE_API_BASE_URL is not set, the app will warn in the console and API requests will likely fail.
- The fetch wrapper adds credentials: 'include'. If your backend does not use cookies, you can ignore this; if it does, ensure CORS is configured accordingly.

## 2) Expected backend endpoints (Notes CRUD)

The frontend calls these endpoints (see src/services/notesApi.ts and src/services/http.ts). All paths are relative to VITE_API_BASE_URL.

- GET "/api/notes"
  - Description: List all notes.
  - Response 200 (application/json): Note[] (array of notes)

- GET "/api/notes/:id"
  - Description: Get a single note by id.
  - Response 200 (application/json): Note

- POST "/api/notes"
  - Description: Create a new note.
  - Request (application/json): { "title": string, "content": string }
  - Response 201/200 (application/json): Note

- PUT "/api/notes/:id"
  - Description: Update an existing note by id.
  - Request (application/json): { "title"?: string, "content"?: string }
  - Response 200 (application/json): Note

- DELETE "/api/notes/:id"
  - Description: Delete a note by id.
  - Response 200/204 (application/json or empty): { "success": boolean } | empty

Note JSON shape expected by the UI (see src/types/note.ts):
```
{
  "id": string | number,
  "title": string,
  "content": string,
  "createdAt": string,  // ISO-8601
  "updatedAt": string   // ISO-8601
}
```

## 3) Using the frontend app (routes, flows, and tips)

- Routes (see src/router/index.ts):
  - "/" (Home): Welcome page with links.
  - "/notes": List of notes with a button to create a new note.
  - "/notes/new": Create form for a note.
  - "/notes/:id": Detail view for a note.
  - "/notes/:id/edit": Edit form for a note.

- Typical flows:
  - Create a note: Go to Notes -> New Note, fill title and content, then Create. You will be redirected to the detail page upon success.
  - View a note: From the list, click View or the card title to open details.
  - Edit a note: From details, click Edit; save to return to details with updated values.
  - Delete a note: From list or details, click Delete and confirm. The note is removed and, if on detail page, you are redirected to the list.

- Error and loading feedback:
  - LoadingSpinner shows when lists or entities are being fetched.
  - ErrorAlert shows API errors with a Retry action where applicable.
  - The store centralizes error messages, and buttons are disabled during requests to prevent duplicate actions.

- Data/state:
  - Pinia store (src/stores/notes.ts) holds the notes list, the selected note, loading flags, and error state.
  - The store interacts with the backend via the notesApi service.

- Accessibility and UX tips:
  - Buttons disable while submitting or deleting to avoid duplicates.
  - Confirmations are used before destructive actions like Delete.
  - Timestamps are displayed using the user’s locale.

- CORS/dev server:
  - The Vite dev server runs on port 3000 (see vite.config.ts). Ensure your backend allows requests from that origin, including CORS headers if on a different host/port.
  - If using cookies/sessions, configure the backend CORS to send Access-Control-Allow-Credentials and allow the dev origin.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with Vitest

```sh
npm run test:unit
```

### Lint with ESLint

```sh
npm run lint
```
