const pool = require("./index");

const createTables = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        image_url VARCHAR(255)
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
        author_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        image_url TEXT,
        FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      );
    `);

    await insertBooksIfEmpty();
  } finally {
    client.release();
  }
};

module.exports = createTables;

const insertBooksIfEmpty = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT COUNT(*) FROM books");
    const bookCount = parseInt(result.rows[0].count, 10);

    if (bookCount === 0) {
      // Insert only if the table is empty

      await client.query(`
        INSERT INTO categories (name) VALUES 
        ('Science Fiction'),
        ('Fantasy'),
        ('Non-Fiction'),
        ('No Category')
        ON CONFLICT (name) DO NOTHING;
    `);

      await client.query(`
        INSERT INTO authors (name) VALUES 
        ('J.R.R. Tolkien'),
        ('George Orwell'),
        ('J.K. Rowling'),
        ('Yuval Noah Harari')
        ON CONFLICT (name) DO NOTHING;
    `);

      await client.query(`
        INSERT INTO books (title, description, author_id, category_id) VALUES 
        ('Harry Potter and the Sorcerer''s Stone', 
          'Harry Potter, a young wizard who discovers his magical heritage on his eleventh birthday when he receives a letter of acceptance to the Hogwarts School of Witchcraft and Wizardry. This marks the beginning of his journey into the wizarding world, where he makes lifelong friends and faces numerous challenges, including the dark wizard Lord Voldemort.', 
          (SELECT id FROM authors WHERE name = 'J.K. Rowling'), 
          (SELECT id FROM categories WHERE name = 'Fantasy')),

        ('Sapiens: A Brief History of Humankind', 
          'Sapiens explores the history of humankind, starting with the emergence of Homo sapiens in the Stone Age and tracing the development of human societies through the Agricultural and Scientific Revolutions. Yuval Noah Harari delves into how humans have come to dominate the planet, the creation of complex social structures, and the future implications of biotechnology and artificial intelligence.', 
          (SELECT id FROM authors WHERE name = 'Yuval Noah Harari'), 
          (SELECT id FROM categories WHERE name = 'Non-Fiction')),

        ('The Hobbit', 
          'The Hobbit, written by J.R.R. Tolkien, is a prelude to the epic Lord of the Rings trilogy. The story follows Bilbo Baggins, a hobbit who is reluctantly drawn into an adventure by the wizard Gandalf and a group of dwarves seeking to reclaim their homeland from the dragon Smaug. Throughout the journey, Bilbo encounters trolls, elves, giant spiders, and more, ultimately discovering his own bravery and resourcefulness.', 
          (SELECT id FROM authors WHERE name = 'J.R.R. Tolkien'), 
          (SELECT id FROM categories WHERE name = 'Fantasy')),

        ('1984', 
          '1984, written by George Orwell, is a dystopian novel set in a totalitarian society ruled by the Party and its leader, Big Brother. The story follows Winston Smith, a man who begins to question the Party''s control and the reality presented to him. Orwell''s chilling depiction of surveillance, propaganda, and the loss of individuality has made 1984 a profound commentary on the dangers of totalitarianism.', 
          (SELECT id FROM authors WHERE name = 'George Orwell'), 
          (SELECT id FROM categories WHERE name = 'Science Fiction'))
          `);

      console.log("Books inserted successfully.");
    } else {
      console.log("Books table is not empty. No insertion performed.");
    }
  } catch (err) {
    console.error("Error inserting books:", err.stack);
  } finally {
    client.release();
  }
};
