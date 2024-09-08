CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    public_key VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    username VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users
ADD CONSTRAINT chk_role CHECK (role IN ('journalist', 'reader'));

CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    author_id INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fact_checks (
    id SERIAL PRIMARY KEY,
    article_id INT REFERENCES articles(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    is_accurate BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    article_id INT REFERENCES articles(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (public_key, username, role)
VALUES ('your-public-key-here', 'initial_journalist', 'journalist');

INSERT INTO articles (title, content, image_url, author_id)
VALUES
('Breaking News: Tech Innovation', 'A new tech innovation is set to change the industry.', 'https://via.placeholder.com/600x400.png?text=Tech+Innovation', 1),
('Health Update: New Wellness Research', 'Recent wellness research provides insights into maintaining a healthy lifestyle.', 'https://via.placeholder.com/600x400.png?text=Wellness+Research', 1),
('Market Watch: Economic Trends', 'Analysts predict significant market trends for the upcoming quarter.', 'https://via.placeholder.com/600x400.png?text=Economic+Trends', 1),
('Entertainment Buzz: Upcoming Movies', 'Exciting new movies are set to hit the theaters this season.', 'https://via.placeholder.com/600x400.png?text=Upcoming+Movies', 1),
('Sports Highlights: Major League', 'Last night’s major league game had thrilling moments.', 'https://via.placeholder.com/600x400.png?text=Major+League+Game', 1),
('Politics Today: Election Updates', 'Updates from the recent elections are now available.', 'https://via.placeholder.com/600x400.png?text=Election+Updates', 1),
('Science Discoveries: Space Exploration', 'New discoveries in space exploration are captivating scientists.', 'https://via.placeholder.com/600x400.png?text=Space+Exploration', 1),
('Travel Guide: Top Destinations', 'Explore the top travel destinations for this year.', 'https://via.placeholder.com/600x400.png?text=Top+Travel+Destinations', 1),
('Business Insights: Startups to Watch', 'These startups are making waves in the business world.', 'https://via.placeholder.com/600x400.png?text=Startups+to+Watch', 1),
('Education Focus: New Learning Tools', 'Innovative learning tools are transforming education.', 'https://via.placeholder.com/600x400.png?text=Learning+Tools', 1);
