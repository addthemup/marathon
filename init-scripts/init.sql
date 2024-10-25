-- Create the 'awc' role if it does not already exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'awc') THEN
        CREATE ROLE awc WITH LOGIN PASSWORD 'Starbury03';
    END IF;
END
$$;

-- Create the database with 'awc' as the owner
CREATE DATABASE marathon OWNER awc;

-- Grant all privileges on the database to 'awc'
GRANT ALL PRIVILEGES ON DATABASE marathon TO awc;
