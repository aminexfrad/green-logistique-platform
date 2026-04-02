# Green Logistique Backend

This backend is built with Django and Django REST Framework. It provides API endpoints for authentication, shipments, carriers, clients, audit logs, and carbon projects.

## Setup

1. Create a Python virtual environment and activate it:

   ```bash
   python -m venv .venv
   source .venv/bin/activate  # macOS / Linux
   .venv\Scripts\Activate    # Windows PowerShell
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file based on `.env.example` and configure your MySQL credentials.

4. Run migrations:

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. Create a superuser:

   ```bash
   python manage.py createsuperuser
   ```

6. Run the development server:

   ```bash
   python manage.py runserver
   ```

## API Endpoints

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

## Notes

- The app uses token authentication.
- Frontend should send `Authorization: Token <token>` in requests.
- `django-cors-headers` is configured to allow frontend access.
