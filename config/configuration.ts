export default () => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  database: {
    url: process.env.DATABASE_URL,
  },
  secret_key: process.env.SECRET_KEY,
});
