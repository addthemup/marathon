-- init.sql
DO $$ BEGIN
   CREATE ROLE awc WITH LOGIN PASSWORD 'Starbury03';
   RAISE NOTICE 'Role awc created';
EXCEPTION
   WHEN DUPLICATE_OBJECT THEN
      RAISE NOTICE 'Role awc already exists';
END $$;

CREATE DATABASE marathon OWNER awc;
RAISE NOTICE 'Database marathon created with owner awc';

GRANT ALL PRIVILEGES ON DATABASE marathon TO awc;
RAISE NOTICE 'Granted all privileges on database marathon to awc';
