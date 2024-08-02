const pool = require("./index");

const createTables = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS authors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        author_name VARCHAR(255) NOT NULL,
        category_name VARCHAR(255) NOT NULL,
        FOREIGN KEY (author_name) REFERENCES authors(name) ON DELETE CASCADE,
        FOREIGN KEY (category_name) REFERENCES categories(name) ON DELETE CASCADE
      );
    `);
  } finally {
    client.release();
  }
};


module.exports = createTables;
