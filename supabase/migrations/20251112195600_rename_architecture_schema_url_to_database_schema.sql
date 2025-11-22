-- Rename column architecture_schema_url to database_schema in projects table
ALTER TABLE projects 
RENAME COLUMN architecture_schema_url TO database_schema;



