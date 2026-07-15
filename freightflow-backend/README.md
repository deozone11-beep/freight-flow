# FreightFlow Backend (Spring Boot)

REST API backend for the FreightFlow / PhoneForge manufacturing dashboard.
Built with Spring Boot 3.3, Spring Data JPA, Spring Security + JWT.
Works with **MySQL** locally and **PostgreSQL** on Render (same code, different driver/profile).

## Modules covered
- `/api/auth` — login, register, current user (JWT based)
- `/api/employees` — CRUD
- `/api/domestic-shipments` — CRUD (Local Dispatch page)
- `/api/international-shipments` — CRUD (International Shipment page)
- `/api/fleet` — CRUD (vehicles)
- `/api/warehouse` — CRUD (warehouse regions)
- `/api/dashboard/stats` — aggregate counts for the Dashboard page

All endpoints except `/api/auth/**` require `Authorization: Bearer <token>` header.

## Default login (auto-seeded on first run)
```
username: admin
password: admin123

Demo seed data: manager1/manager123, driver1/driver123, customer1/customer123, company1/company123 (plus existing admin/admin123)
```
**Change this password (or create a new admin via `/api/auth/register`) before going live.**

## Run locally (MySQL)

1. Install MySQL, create nothing manually — the app auto-creates the `freightflow` DB.
2. Set env vars (or edit `application-local.properties` directly):
   ```
   DB_USERNAME=root
   DB_PASSWORD=yourpassword
   JWT_SECRET=some-long-random-string-at-least-32-characters
   ```
3. Run:
   ```
   mvn spring-boot:run
   ```
   App starts on `http://localhost:8080` with profile `local` (default).

## Deploy on Render

### 1. Push this backend folder to a GitHub repo (separate repo or a `backend/` folder in your project repo).

### 2. Create a PostgreSQL instance on Render
- Render dashboard → New → PostgreSQL → free tier.
- Once created, note the **Host, Port, Database, User, Password** from the "Info" tab (NOT the connection string — we use separate vars).

### 3. Create a Web Service on Render
- New → Web Service → connect your repo (point to this backend folder if monorepo).
- Environment: **Docker** or **Java** — simplest is:
  - Build Command: `./mvnw clean package -DskipTests` (or `mvn clean package -DskipTests`)
  - Start Command: `java -jar target/freightflow-backend-1.0.0.jar`
- Add environment variables:
  ```
  SPRING_PROFILES_ACTIVE=prod
  DB_HOST=<from Render Postgres info tab>
  DB_PORT=5432
  DB_NAME=<from Render Postgres info tab>
  DB_USER=<from Render Postgres info tab>
  DB_PASSWORD=<from Render Postgres info tab>
  JWT_SECRET=<generate a long random string>
  ```
- Render sets `PORT` automatically — the app already reads it (`server.port=${PORT:8080}`).

### 4. Update CORS
In `SecurityConfig.java`, `corsConfigurationSource()` already allows `https://*.onrender.com`.
Once your frontend is deployed, you can tighten this to your exact frontend URL.

### 5. First deploy
Hibernate `ddl-auto=update` will auto-create all tables in Postgres on first boot, and
`DataSeeder` will insert the default admin login + sample fleet/warehouse rows.

## Notes
- Passwords are BCrypt-hashed, never stored in plain text.
- JWT expires in 24h by default (`JWT_EXPIRATION_MS`).
- `ddl-auto=update` is fine for this project size; for a stricter production setup, switch to Flyway/Liquibase migrations later.
