-- Rajasthan Trip Database Schema
-- Run this to initialize your Vercel Postgres database

-- Cities table
CREATE TABLE IF NOT EXISTS cities (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  dates VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hotels table
CREATE TABLE IF NOT EXISTS hotels (
  id VARCHAR(255) PRIMARY KEY,
  city_id VARCHAR(255) NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  link TEXT,
  price2 INTEGER,
  price3 INTEGER,
  image TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
  id SERIAL PRIMARY KEY,
  hotel_id VARCHAR(255) NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  city_id VARCHAR(255) NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  voter_name VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  occupancy INTEGER NOT NULL CHECK (occupancy IN (2, 3)),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_hotels_city_id ON hotels(city_id);
CREATE INDEX IF NOT EXISTS idx_votes_hotel_id ON votes(hotel_id);
CREATE INDEX IF NOT EXISTS idx_votes_city_id ON votes(city_id);

-- App metadata table for storing configuration
CREATE TABLE IF NOT EXISTS app_config (
  key VARCHAR(255) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
