
# True-Story

This project is based on the [create-solana-dapp](https://github.com/solana-developers/create-solana-dapp) generator.

## Additional Resources

For more information, please refer to our product wiki: [Product Wiki](https://organic-dew-c9f.notion.site/5acf0f1d33074635bd2d85ae7961b570?v=d81acf2f780945aa91002f82d131f922)

## Getting Started

### Prerequisites

- Node v18.18.0 or higher
- PostgreSQL database set up and running

### Installation

#### Clone the repo

```shell
git clone https://github.com/bumaftw/true-story.git
cd true-story
```

#### Install Dependencies

```shell
npm install
```

---

## Apps

### Web (Frontend)

This is a React app.

#### Commands

To start or build the web app:

- **Start the web app in development mode**:

  ```shell
  npm run dev
  ```

- **Build the web app for production**:

  ```shell
  npm run build
  ```

---

### Backend (API)

This is a Node.js API using Express with PostgreSQL as the database. It requires setting up environment variables and running migrations.

#### Setup

1. **Install Dependencies**:

   ```shell
   npm install
   ```

2. **Create a `.env` file** in the `./backend` directory with the necessary environment variables based on `.env.sample` file. For example:

   ```bash
    SERVICE_NAME=true-story-api
    PORT=4001
    DATABASE_URL=postgres://username:password@localhost:5432/database
   ```

3. **Run Database Migrations**:

   Make sure you have PostgreSQL installed and running, then run the following command to apply migrations:

   ```shell
   npm run db:migrate
   ```

#### Commands

- **Start the backend in development mode**:

  ```shell
  npm run dev
  ```

- **Build the backend for production**:

  ```shell
  npm run build
  ```

- **Start the backend in production mode**:

  ```shell
  npm start
  ```

- **Run database migrations**:

  ```shell
  npm run db:migrate
  ```

- **Revert the last migration**:

  ```shell
  npm run db:migrate:down
  ```
