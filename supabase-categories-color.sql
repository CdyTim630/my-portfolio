-- Add color column to categories table
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS color TEXT DEFAULT 'blue';

-- Update existing categories with default colors
UPDATE categories SET color = 'blue' WHERE name = '台大資管生活';
UPDATE categories SET color = 'emerald' WHERE name = '生活紀錄';
UPDATE categories SET color = 'purple' WHERE name = '心得';
UPDATE categories SET color = 'amber' WHERE name = '旅遊';
