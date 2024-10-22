ALTER TABLE users
DROP CONSTRAINT IF EXISTS chk_role;

ALTER TABLE users
ADD CONSTRAINT chk_role CHECK (role IN ('journalist', 'reader'));
