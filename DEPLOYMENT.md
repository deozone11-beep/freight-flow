git init# FreightFlow (PhoneForge) — Full Stack Deployment Guide

This project has 2 parts:
- `freight-flow/` — React + Vite frontend
- `freightflow-backend/` — Spring Boot backend (separate zip)

Both are already wired together: the frontend calls the backend via `VITE_API_BASE_URL`,
and login uses real JWT auth from the backend (default seeded login: `admin` / `admin123`).

## 1. Test locally first

**Backend:**
```
cd freightflow-backend
mvn spring-boot:run
```
Runs on `http://localhost:8080` (profile `local`, needs MySQL running — see backend README).

**Frontend:**
```
cd freight-flow
cp .env.example .env
npm install
npm run dev
```
Runs on `http://localhost:5173`. Login with `admin` / `admin123`.

## 2. Deploy on Render (3 pieces)

### A. PostgreSQL database
Render dashboard → New → PostgreSQL → free tier → create.
Note Host, Port, Database, User, Password from the Info tab.

### B. Backend (Web Service)
- New → Web Service → connect your repo → point to `freightflow-backend/` folder.
- Build Command: `mvn clean package -DskipTests`
- Start Command: `java -jar target/freightflow-backend-1.0.0.jar`
- Environment variables:
  ```
  SPRING_PROFILES_ACTIVE=prod
  DB_HOST=<render postgres host>
  DB_PORT=5432
  DB_NAME=<render postgres db name>
  DB_USER=<render postgres user>
  DB_PASSWORD=<render postgres password>
  JWT_SECRET=<any long random string, 32+ chars>
  ```
- After deploy, note your backend URL, e.g. `https://freightflow-backend.onrender.com`.

### C. Frontend (Static Site)
- New → Static Site → connect your repo → point to `freight-flow/` folder.
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment variable:
  ```
  VITE_API_BASE_URL=https://freightflow-backend.onrender.com/api
  ```
- Deploy.

### D. Lock down CORS
In the backend's `SecurityConfig.java`, `corsConfigurationSource()` currently allows
`https://*.onrender.com`. Once you have your exact frontend URL, you can narrow this
to just that URL for tighter security (optional but recommended before going fully live).

## 3. First login on production
Visit your frontend Render URL → login with `admin` / `admin123` → **change this
password immediately** by registering a new admin via `/api/auth/register` (or add a
"change password" endpoint later) and disabling/removing the default account.

## 4. Notes
- Free Render web services sleep after inactivity — first request after idle can take
  ~30-50s to wake up. This is normal on the free tier.
- `ddl-auto=update` auto-creates/updates tables on each deploy — fine for this project;
  for stricter production control later, switch to Flyway/Liquibase migrations.
