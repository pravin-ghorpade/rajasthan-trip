-- Migration to add device_id to votes table for duplicate prevention
ALTER TABLE votes ADD COLUMN IF NOT EXISTS device_id VARCHAR(255);

-- Create index for faster duplicate checks
CREATE INDEX IF NOT EXISTS idx_votes_voter_device ON votes(voter_name, device_id, hotel_id);
