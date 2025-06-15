export const dbConfig = () => ({
  NODE_ENV: process.env.NODE_ENV,
  database: {
    host: process.env.DB_HOST,
    url: process.env.DB_URL,
    username: process.env.DB_ROOT,
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_DATABASE,
  },
});
