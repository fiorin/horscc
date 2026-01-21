-- Hot Wheels Collection Database Schema
-- Complete database setup for the horscc project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cars table - Main collection storage
CREATE TABLE IF NOT EXISTS cars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    alias VARCHAR(255),
    description TEXT,
    year INTEGER NOT NULL,
    brand VARCHAR(100) NOT NULL,
    color VARCHAR(50) NOT NULL,
    is_rubber_tires BOOLEAN DEFAULT false,
    is_metal_body BOOLEAN DEFAULT false,
    is_owned BOOLEAN DEFAULT false,
    image_url TEXT,
    image_count INTEGER DEFAULT 0,
    buy_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    acquired_at TIMESTAMP WITH TIME ZONE,
    rarity VARCHAR(20) CHECK (rarity IN ('regular', 'premium', 'exclusive')),
    estimated_value DECIMAL(10, 2)
);

-- Shelves table - Virtual display shelves
CREATE TABLE IF NOT EXISTS shelves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    grid_x INTEGER NOT NULL DEFAULT 8,
    grid_y INTEGER NOT NULL DEFAULT 4,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shelf positions table - Maps cars to shelf positions
CREATE TABLE IF NOT EXISTS shelf_positions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shelf_id UUID NOT NULL REFERENCES shelves(id) ON DELETE CASCADE,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    car_id UUID REFERENCES cars(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(shelf_id, x, y)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cars_is_owned ON cars(is_owned);
CREATE INDEX IF NOT EXISTS idx_cars_brand ON cars(brand);
CREATE INDEX IF NOT EXISTS idx_cars_rarity ON cars(rarity);
CREATE INDEX IF NOT EXISTS idx_cars_acquired_at ON cars(acquired_at);
CREATE INDEX IF NOT EXISTS idx_shelf_positions_shelf_id ON shelf_positions(shelf_id);
CREATE INDEX IF NOT EXISTS idx_shelf_positions_car_id ON shelf_positions(car_id);

-- Row Level Security (RLS) Policies
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE shelves ENABLE ROW LEVEL SECURITY;
ALTER TABLE shelf_positions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all cars
CREATE POLICY "Allow authenticated users to view cars"
    ON cars FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to insert cars
CREATE POLICY "Allow authenticated users to insert cars"
    ON cars FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow authenticated users to update cars
CREATE POLICY "Allow authenticated users to update cars"
    ON cars FOR UPDATE
    TO authenticated
    USING (true);

-- Allow authenticated users to delete cars
CREATE POLICY "Allow authenticated users to delete cars"
    ON cars FOR DELETE
    TO authenticated
    USING (true);

-- Allow authenticated users to view shelves
CREATE POLICY "Allow authenticated users to view shelves"
    ON shelves FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to manage shelves
CREATE POLICY "Allow authenticated users to manage shelves"
    ON shelves FOR ALL
    TO authenticated
    USING (true);

-- Allow authenticated users to view shelf positions
CREATE POLICY "Allow authenticated users to view shelf_positions"
    ON shelf_positions FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to manage shelf positions
CREATE POLICY "Allow authenticated users to manage shelf_positions"
    ON shelf_positions FOR ALL
    TO authenticated
    USING (true);

-- Enable realtime for shelf positions (for live updates)
ALTER PUBLICATION supabase_realtime ADD TABLE shelf_positions;

-- Sample data (optional - comment out if not needed)
-- Insert a default shelf
INSERT INTO shelves (name, grid_x, grid_y)
VALUES ('Main Display', 8, 4)
ON CONFLICT DO NOTHING;
