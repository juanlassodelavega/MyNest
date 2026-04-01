# MyNest

MyNest is a pet-focused social and utility app where users can manage their pets, track reminders, and explore nearby pet-friendly places on a map.

The project is built with React, TypeScript, Firebase, and Leaflet.

## Features

- Email/password authentication with Firebase Auth.
- User profile management and password updates.
- Pet CRUD flow (create, edit, delete).
- Reminders per pet stored in Firestore subcollections.
- Interactive map with nearby veterinary points, pet shops, parks, and grooming places.
- Protected routes for authenticated pages.
- Responsive layouts for desktop and mobile.

## Tech Stack

- Frontend: React + TypeScript + Vite
- Routing: React Router
- Authentication: Firebase Auth
- Database: Firebase Firestore
- Maps: Leaflet + React-Leaflet
- UI: React Icons + custom CSS tokens

## Local Setup

1. Clone the repository.

```bash
git clone https://github.com/your-user/MyNest.git
cd MyNest
```

2. Install dependencies.

```bash
npm install
```

3. Create a Firebase project and configure environment variables.

Create a .env.local file in the project root:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Run the development server.

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Build

```bash
npm run build
```

## Authors

- Juan Lasso de la Vega
- Miguel Lasso de la Vega
