-- start the transaction
BEGIN;
    -- update the type and default values for the table
    ALTER TABLE items ALTER COLUMN default_colour TYPE text;
    ALTER TABLE items ALTER COLUMN default_colour SET DEFAULT concat('#', upper(substr(md5(random()::text), 0, 7)));

    -- add a hash to each colour
    UPDATE items SET default_colour = concat('#', default_colour);

    -- alter the name
    ALTER TABLE items RENAME COLUMN default_colour TO colour;
COMMIT;