# backend

This is the backend API for the blog platform.

## Tech Stack

- **Runtime**: Bun
- **Framework**: Express.js 5.x
- **ORM**: Prisma (Neon PostgreSQL adapter)
- **Authentication**: Better Auth
- **Image Storage**: Cloudinary (via multer)
- **Rate Limiting**: Redis
- **Tooling**: TypeScript, express-validator, morgan, helmet, cors

## Project Structure

```text
src/
├── controllers/   # Request handlers
├── lib/           # External service setups (Better Auth, Cloudinary, etc.)
├── middlewares/   # Express middlewares (auth guarding, errors, rate limits)
├── routes/        # Express route definitions
├── services/      # Core business logic
├── utils/         # Helper functions
└── validators/    # express-validator schemas
prisma/
├── schema.prisma  # Database schema
├── migrations/    # SQL migration histories
└── seed.ts        # Database seeding script
```

## Setup & Run

1. **Install Dependencies**

   ```bash
   bun install
   ```

2. **Environment Variables**

   Ensure an `.env` file is present in the root directory:

   ```env
   BETTER_AUTH_SECRET=your-auth-secret
   BETTER_AUTH_URL=your-frontend-url
   DATABASE_URL=
   DIRECT_URL=
   FRONTEND_URL=your-frontend-url (Example: http://localhost:5173 or https://your-domain.com)
   REDIS_USERNAME=your-redis-username
   REDIS_PASSWORD=your-redis-password
   REDIS_HOST=your-redis-host
   REDIS_PORT=your-redis-port
   CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
   NODE_ENV=development
   ```

3. **Database Setup**

   Generate the Prisma client and push the schema (or run migrations):

   ```bash
   bunx --bun prisma generate
   bunx --bun prisma db push
   # To seed the database (optional)
   bun run prisma db seed
   ```

4. **Development Server**

   ```bash
   bun run dev
   ```

   The server will start (typically on port 3000, depending on your setup).

5. **Production Start**

   ```bash
   bun run start
   ```

## Key Features

- **Robust Authentication**: Uses Better Auth for session and API key management.
- **Database Access**: Type-safe database queries via Prisma ORM connected to a PostgreSQL database.
- **File Uploads**: Handles multipart/form-data with `multer` and streams optimizations to Cloudinary.
- **Security & Reliability**: Secured with Helmet and CORS, input fully validated by `express-validator`, and request flooding mitigated via Redis-backed rate limiting.
