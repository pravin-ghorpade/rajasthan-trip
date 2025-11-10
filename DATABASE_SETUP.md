# Database Setup Guide

This guide will help you set up Vercel Postgres database for the Rajasthan Trip application.

## Why Database?

The previous version used file-based storage (JSON files) which doesn't work on Vercel's production environment because:
- Vercel's filesystem is **read-only** in production
- File writes fail with "Internal Server Error"
- Changes are lost on each deployment

The solution is to use **Vercel Postgres** - a serverless PostgreSQL database that persists data permanently.

## Setup Steps

### 1. Create Vercel Postgres Database

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your project: `rajasthan-trip`
3. Go to the **Storage** tab
4. Click **Create Database**
5. Choose **Postgres**
6. Select a region close to your users (e.g., US East)
7. Click **Create**

### 2. Connect Database to Your Project

Vercel will automatically add environment variables to your project:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

These are automatically available in your deployed app.

### 3. Set Up Local Development (Optional)

To test database locally:

1. Go to your project Settings → Environment Variables
2. Copy the `POSTGRES_URL` value
3. Create `.env.local` in your project root:

```bash
POSTGRES_URL="your-postgres-url-here"
```

4. Add `.env.local` to `.gitignore` (should already be there)

### 4. Initialize Database Schema

You need to create the tables in your database. You have two options:

#### Option A: Use Vercel's SQL Editor (Recommended)

1. In Vercel Dashboard, go to Storage → Your Postgres Database
2. Click on the **Data** tab
3. Click **Query**
4. Copy and paste the contents of `src/db/schema.sql`
5. Click **Run Query**

#### Option B: Use a Database Client

1. Use the `POSTGRES_URL` to connect with a tool like:
   - [Postico](https://eggerapps.at/postico/) (Mac)
   - [pgAdmin](https://www.pgadmin.org/) (Cross-platform)
   - [TablePlus](https://tableplus.com/) (Cross-platform)

2. Connect and run the SQL from `src/db/schema.sql`

### 5. Seed Database with Initial Data

After creating the tables, you need to populate them with your hotel data:

1. Make sure you're in the project directory
2. Run the seed script:

```bash
npx tsx src/db/seed.ts
```

This will:
- Read data from `src/data/rajasthan_data_with_images_20251110_024141.json`
- Insert all cities into the `cities` table
- Insert all hotels into the `hotels` table
- Set up app configuration

### 6. Deploy to Vercel

Now your app is ready to deploy:

```bash
git add .
git commit -m "Migrate to database storage"
git push
```

Vercel will automatically deploy the changes.

### 7. Verify Everything Works

1. Visit your deployed app
2. Go to the **Manage** tab
3. Try editing a hotel - it should work now! ✅
4. Try adding a new hotel
5. Go to other tabs and verify hotels display correctly

## Database Schema

### Cities Table
- `id` (Primary Key)
- `name`
- `dates`
- `created_at`
- `updated_at`

### Hotels Table
- `id` (Primary Key)
- `city_id` (Foreign Key → cities.id)
- `name`
- `link`
- `price2` (2 person price)
- `price3` (3 person price)
- `image`
- `notes`
- `created_at`
- `updated_at`

### Votes Table
- `id` (Auto-increment Primary Key)
- `hotel_id` (Foreign Key → hotels.id)
- `city_id` (Foreign Key → cities.id)
- `voter_name`
- `rating` (1-5)
- `occupancy` (2 or 3)
- `notes`
- `created_at`
- `updated_at`

### App Config Table
- `key` (Primary Key)
- `value` (JSONB - stores app configuration)
- `updated_at`

## API Endpoints

All API endpoints now use the database:

### GET `/api/hotels`
Fetches all cities and hotels from database

### POST `/api/hotels`
Adds a new hotel to database

### PUT `/api/hotels`
Updates an existing hotel in database

### DELETE `/api/hotels`
Deletes a hotel from database

### GET `/api/votes`
Fetches all votes from database

### POST `/api/votes`
Submits a new vote to database

## Troubleshooting

### Error: "Cannot connect to database"
- Make sure environment variables are set correctly
- Check that database was created in Vercel dashboard
- Verify `POSTGRES_URL` is accessible

### Error: "relation does not exist"
- You haven't run the schema SQL yet
- Go back to Step 4 and create the tables

### Error: "No data showing"
- You haven't seeded the database yet
- Run `npx tsx src/db/seed.ts`

### Local development not working
- Make sure `.env.local` exists with `POSTGRES_URL`
- Restart your dev server after adding environment variables

## Benefits of Database Storage

✅ **Persistent** - Data survives deployments  
✅ **Scalable** - Handles multiple users simultaneously  
✅ **Fast** - Optimized queries with indexes  
✅ **Reliable** - Automatic backups by Vercel  
✅ **Secure** - Encrypted connections  
✅ **Real-time** - Changes visible immediately to all users  

## Cost

Vercel Postgres free tier includes:
- 256 MB storage
- 60 hours of compute per month
- Perfect for this application!

Upgrade if you need more: https://vercel.com/docs/storage/vercel-postgres/usage-and-pricing
