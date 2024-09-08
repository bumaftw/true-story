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
('Breaking News: Tech Innovation',
'The world of technology is constantly evolving, but a recent innovation has the potential to disrupt multiple industries. Experts are calling it a breakthrough that could revolutionize how businesses operate and how consumers interact with tech. This new technology integrates artificial intelligence, blockchain, and cloud computing to offer a seamless solution for data management and predictive analytics. Companies in finance, healthcare, and logistics are already exploring its applications. While the technology is still in its infancy, the early adopters are already seeing significant returns on investment.',
'https://via.placeholder.com/600x400.png?text=Tech+Innovation', 1),

('Health Update: New Wellness Research',
'Recent studies in the wellness sector are shedding light on the benefits of holistic approaches to health. Researchers have focused on the impact of mindfulness, balanced diets, and regular exercise on mental and physical health. Findings suggest that integrating these practices into daily life can significantly reduce stress, improve cognitive function, and enhance emotional well-being. One study in particular demonstrated that individuals who practice mindfulness meditation for at least 10 minutes a day show improved focus and decreased levels of cortisol, the stress hormone. This has led to a surge in wellness apps and programs designed to promote healthy living.',
'https://via.placeholder.com/600x400.png?text=Wellness+Research', 1),

('Market Watch: Economic Trends',
'With the global economy facing unprecedented challenges, analysts are keeping a close eye on emerging trends. Key indicators point to a potential slowdown in growth across various sectors, with particular concern in manufacturing and consumer spending. However, there are also signs of resilience, particularly in the tech and renewable energy sectors. Economists are advising businesses to remain cautious but optimistic, as new government policies and trade agreements could help stimulate recovery. The stock market has responded with volatility, as investors weigh the risks and opportunities in the months ahead.',
'https://via.placeholder.com/600x400.png?text=Economic+Trends', 1),

('Entertainment Buzz: Upcoming Movies',
'The film industry is gearing up for an exciting season of new releases, with several highly anticipated movies set to hit theaters in the coming months. Fans of action, drama, and comedy are all in for a treat, as directors and studios unveil projects that have been in the making for years. Some of the most talked-about titles include sequels to beloved franchises, as well as bold new stories that challenge genre conventions. The buzz around these films is palpable, with many predicting box office records to be shattered. Film festivals are also playing a major role in previewing these movies, generating early reviews and awards buzz.',
'https://via.placeholder.com/600x400.png?text=Upcoming+Movies', 1),

('Sports Highlights: Major League',
'In a thrilling display of athleticism and strategy, last night’s major league game delivered some unforgettable moments. The teams were evenly matched, and the game went down to the wire, with the final play determining the outcome. Fans were on the edge of their seats as their favorite players demonstrated skill, teamwork, and determination. The highlight of the night came in the final inning, when a dramatic home run secured the victory for the underdog team. With the season heading into its final stretch, every game counts, and the players are leaving it all on the field.',
'https://via.placeholder.com/600x400.png?text=Major+League+Game', 1),

('Politics Today: Election Updates',
'As election season intensifies, voters across the country are gearing up for what promises to be a pivotal moment in politics. Campaigns are in full swing, with candidates traveling across states to rally support and outline their visions for the future. Key issues on the ballot include healthcare reform, climate change, and economic recovery, with debates becoming more heated as the election date approaches. Early polls show tight races in several battleground states, and political analysts are closely watching voter turnout and campaign strategies as the final weeks of the race unfold.',
'https://via.placeholder.com/600x400.png?text=Election+Updates', 1),

('Science Discoveries: Space Exploration',
'Humanity’s fascination with the stars continues as new discoveries in space exploration make headlines. The latest mission to explore the outer edges of our solar system has returned with stunning images and data, offering scientists a deeper understanding of distant planets and celestial bodies. The mission, which lasted over a decade, faced numerous challenges but ultimately succeeded in gathering critical information that could shape future space travel. The findings have sparked a renewed interest in space exploration, with scientists and researchers eager to push the boundaries of what is possible in the final frontier.',
'https://via.placeholder.com/600x400.png?text=Space+Exploration', 1),

('Travel Guide: Top Destinations',
'As travel restrictions ease, many people are planning their next great adventure. This year’s top travel destinations include a mix of exotic locales and hidden gems. Whether you’re looking to relax on a pristine beach, explore historic cities, or hike through breathtaking landscapes, there’s something for everyone. Travel experts recommend booking early to secure the best deals, as pent-up demand is expected to lead to a surge in bookings. From the vibrant streets of Tokyo to the serene islands of the Maldives, these destinations are sure to inspire your next getaway.',
'https://via.placeholder.com/600x400.png?text=Top+Travel+Destinations', 1),

('Business Insights: Startups to Watch',
'The startup ecosystem is buzzing with new innovations, and several emerging companies are making waves across various industries. These startups are focused on leveraging cutting-edge technologies to solve real-world problems, from renewable energy solutions to AI-driven customer experiences. Investors are taking notice, with many startups securing significant funding in their early stages. As these companies grow and scale, they are expected to disrupt traditional business models and drive significant changes in their respective fields. Entrepreneurs and business leaders are keeping a close watch on these rising stars as they continue to gain traction.',
'https://via.placeholder.com/600x400.png?text=Startups+to+Watch', 1),

('Education Focus: New Learning Tools',
'As technology continues to transform the education sector, new learning tools are emerging that promise to enhance the learning experience for students of all ages. From interactive apps to virtual classrooms, these tools are designed to make learning more engaging, accessible, and personalized. Teachers and educators are embracing these innovations, which allow for more flexible and tailored approaches to instruction. Studies show that students who use these tools perform better in assessments and demonstrate higher levels of engagement. The future of education is digital, and these learning tools are leading the way.',
'https://via.placeholder.com/600x400.png?text=Learning+Tools', 1);
