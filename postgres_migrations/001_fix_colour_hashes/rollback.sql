-- remove the hash from each colour
UPDATE items SET colour = substr(colour, 2);

-- set the original defaults and type
ALTER TABLE items ALTER COLUMN colour TYPE char(6);
ALTER TABLE items ALTER COLUMN colour SET DEFAULT upper(substr(md5(random()::text), 0, 7));

-- revert the name
ALTER TABLE items RENAME COLUMN colour TO default_colour;