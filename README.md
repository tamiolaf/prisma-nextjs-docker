# Next.js + Prisma + PostgreSQL Docker Guide

This project uses a dual-Docker setup: one for **Development** (with hot-reloading) and one for **Production** (optimized standalone build). Both setups share a PostgreSQL database with persistent data.

## 📂 Project Structure

Ensure your project root contains these specific files:

```text
.
├── .env                      # Environment variables (Secrets)
├── docker-compose.yml        # Development orchestration
├── docker-compose.prod.yml   # Production orchestration
├── Dockerfile.dev            # Development image definition
├── Dockerfile.prod           # Production image definition
├── next.config.js            # Next.js configuration
└── prisma/
    └── schema.prisma         # Database schema
```

---

## Quick Start

### Configure Environment
Create a `.env` file in the root.
**Crucial:** We use `localhost` for the host machine, but Docker will override this internally to communicate between containers.

```bash
# .env
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=mydb

# Connection string for Local Tools (e.g. Prisma Studio running on host)
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydb?schema=public"
```

### Configure Next.js
Update `next.config.js` to enable Standalone mode (required for Production Docker).

```javascript
// next.config.js
module.exports = {
  output: 'standalone',
  // ... other config
};
```

---

## Development Workflow
*Features: Hot Reloading (HMR), Source maps, Exposed DB port.*

### Start Development
```bash
docker-compose up --build
```
- App is available at: `http://localhost:3000`
- Database is available at: `localhost:5432`
- **Code Changes:** Edit files locally, and the container updates instantly.

### Stop Development
```bash
docker-compose down
```
*(Data is preserved in the Docker Volume)*

---

## Production Workflow
*Features: Optimized build, Small image size, Static assets served efficiently.*

### Test Production Locally
```bash
# 1. Stop dev containers to free up ports
docker-compose down

# 2. Build and start production
docker-compose -f docker-compose.prod.yml up --build -d
```
- App is available at: `http://localhost` (Port 80)
- **Note:** Changes to code require a rebuild to take effect.

### Deploying Updates
To deploy new code, pull the changes and run:
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

---

## Database Management (Prisma)

Since the database runs inside Docker, you have two ways to run migrations.

### Method A: Run from Host (Recommended for Dev)
Because we expose port `5432` in `docker-compose.yml`, you can run Prisma commands from your local terminal.

```bash
# Run migration
npx prisma migrate dev --name init

# Open Prisma Studio
npx prisma studio
```

### Method B: Run inside Container (Recommended for CI/CD)
If you don't have Node installed locally, run commands inside the container.

```bash
# For Development Container
docker exec -it nextjs-app-dev npx prisma migrate dev

# For Production Container
docker exec -it nextjs-app-prod npx prisma migrate deploy
```