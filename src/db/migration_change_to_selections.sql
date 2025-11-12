-- Migration: Change from ratings to selections
-- This changes the votes table to store selections instead of ratings

-- Drop the rating column and add selection flag
ALTER TABLE votes DROP COLUMN IF EXISTS rating;

-- Rename the table to selections for clarity (optional, but makes more sense)
-- ALTER TABLE votes RENAME TO selections;

-- Add is_selected boolean column (true = user selected this hotel)
ALTER TABLE votes ADD COLUMN IF NOT EXISTS is_selected BOOLEAN DEFAULT true;

-- The occupancy column already exists, so we just need to make sure it's there
-- ALTER TABLE votes ADD COLUMN IF NOT EXISTS occupancy INTEGER DEFAULT 2;

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_votes_selection ON votes(voter_name, device_id, city_id, is_selected);
