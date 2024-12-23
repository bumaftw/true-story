CREATE TABLE sharable_links (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    uuid VARCHAR(64) DEFAULT gen_random_uuid() NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
    UNIQUE (uuid)
);
