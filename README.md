# Green Logistique Platform

A sustainable logistics platform with a Django REST backend and a Next.js frontend.

## Repository Structure

- `backend/` — Django project and REST API.
- `frontend/` — Next.js application and user interface.
- `BACKEND_ACTOR_MODEL_SCHEMA.md` — backend schema/design notes.

## Prerequisites

- Python 3.11+ (recommended 3.12)
- Node.js 18+ / npm 10+
- MySQL server
- Git

## Backend Setup

1. Open a terminal and navigate to the backend folder:

   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:

   macOS / Linux:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```

   Windows PowerShell:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Copy the example environment file and set your values:

   ```bash
   copy .env.example .env
   ```

   Then update `.env` with your MySQL credentials and any other settings.

5. Run migrations:

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. Create a superuser:

   ```bash
   python manage.py createsuperuser
   ```

7. Start the backend server:

   ```bash
   python manage.py runserver
   ```

   The backend will be available at `http://127.0.0.1:8000`.

## Frontend Setup

1. Open a terminal and navigate to the frontend folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the example frontend environment file if you want to customize the API URL:

   ```bash
   copy .env.example .env
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`.

## Environment Variables

### Backend (`backend/.env`)

- `DJANGO_SECRET_KEY` — Django secret key.
- `DJANGO_DEBUG` — `true` or `false`.
- `DJANGO_ALLOWED_HOSTS` — allowed hostnames.
- `DJANGO_DB_ENGINE` — database engine, typically `mysql`.
- `DJANGO_DB_NAME` — database name.
- `DJANGO_DB_USER` — database user.
- `DJANGO_DB_PASSWORD` — database password.
- `DJANGO_DB_HOST` — database host.
- `DJANGO_DB_PORT` — database port.

### Frontend (`frontend/.env`)

- `NEXT_PUBLIC_API_URL` — backend API URL. Defaults to `http://localhost:8000` if not set.

## Running Both Locally

1. Start the backend:

   ```bash
   cd backend
   .\.venv\Scripts\Activate
   python manage.py runserver
   ```

2. Start the frontend in a second terminal:

   ```bash
   cd frontend
   npm run dev
   ```

3. Visit `http://localhost:3000` in your browser.

## Useful Commands

### Backend

- `python manage.py runserver` — start development server.
- `python manage.py makemigrations` — create new migrations.
- `python manage.py migrate` — apply migrations.
- `python manage.py createsuperuser` — create admin user.

### Frontend

- `npm run dev` — start Next.js dev server.
- `npm run build` — build production assets.
- `npm run start` — start the production server after build.
- `npm run lint` — run ESLint.

## API Endpoints

The backend provides endpoints such as:

- `POST /api/auth/login/`
- `POST /api/auth/register/`
- `GET /api/shipments/`
- `GET /api/carriers/`
- `GET /api/vehicles/`
- `GET /api/users/` (admin only)
- `GET /api/audit-logs/` (admin only)
- `GET /api/carbon-projects/`
- `GET /api/orders/`
- `GET /api/track/?trackingNumber=...`

## Authentication

- The backend uses token authentication.
- Include the header `Authorization: Token <token>` in requests.

## Notes

- The frontend expects the backend API at `http://localhost:8000` by default.
- If you change the backend host or port, update `frontend/.env` with `NEXT_PUBLIC_API_URL`.
- Make sure MySQL is running and accessible from the backend.

## Additional Documentation

- `backend/README.md` — backend-specific documentation.
- `frontend/README.md` — frontend-specific notes.
