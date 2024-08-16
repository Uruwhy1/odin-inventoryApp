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
        name VARCHAR(255) NOT NULL,
        image_url VARCHAR(255)
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

const insertBooksIfEmpty = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT COUNT(*) FROM books");
    const bookCount = parseInt(result.rows[0].count, 10);

    if (bookCount === 0) {
      // Insert only if the table is empty

      await client.query(`
        INSERT INTO categories (name, image_url) VALUES 
        ('No Category', ''),
        ('Science Fiction', 'https://img.freepik.com/free-photo/futuristic-view-high-tech-earth-planet_23-2151100395.jpg?t=st=1723478609~exp=1723482209~hmac=5b5047ac1fb39d89c31118a72615d81214c33569da1e5079ff6ac0059ca35121&w=996'),
        ('Fantasy', 'https://img.freepik.com/free-photo/beautiful-mountains-landscape_23-2151151037.jpg?t=st=1723478110~exp=1723481710~hmac=1910e40e8584b06ac5ed526e7b318583bb52bcc6141b23db7c121a198e60fc0d&w=996'),
        ('Non-Fiction', 'https://img.freepik.com/free-photo/close-up-open-book-armchair_23-2147615042.jpg?t=st=1723478641~exp=1723482241~hmac=147bea5a992d25576c3edaf97b4149abb845c4334c88c5f7d2ae7b218d0ea358&w=996')
        ON CONFLICT (name) DO NOTHING;
      `);

      await client.query(`
        INSERT INTO authors (name, image_url) VALUES 
        ('No Author', ''),
        ('J.R.R. Tolkien', 'https://cdn.britannica.com/65/66765-050-63A945A7/JRR-Tolkien.jpg'),
        ('George Orwell', 'https://www.biografiasyvidas.com/biografia/o/fotos/orwell.jpg'),
        ('Yuval Noah Harari', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnaDGIAPVDcGxBeaKFBwPP3QOqsOJdbr3uIQ&s')
        ON CONFLICT (name) DO NOTHING;
    `);

      await client.query(`
        INSERT INTO books (title, description, author_id, category_id, image_url) VALUES 
        ('Sapiens: A Brief History of Humankind', 
          'Sapiens explores the history of humankind, starting with the emergence of Homo sapiens in the Stone Age and tracing the development of human societies through the Agricultural and Scientific Revolutions. Yuval Noah Harari delves into how humans have come to dominate the planet, the creation of complex social structures, and the future implications of biotechnology and artificial intelligence.', 
          (SELECT id FROM authors WHERE name = 'Yuval Noah Harari'), 
          (SELECT id FROM categories WHERE name = 'Non-Fiction'),
          'https://m.media-amazon.com/images/I/713jIoMO3UL._AC_UF1000,1000_QL80_.jpg'),

        ('The Hobbit', 
          'The Hobbit, written by J.R.R. Tolkien, is a prelude to the epic Lord of the Rings trilogy. The story follows Bilbo Baggins, a hobbit who is reluctantly drawn into an adventure by the wizard Gandalf and a group of dwarves seeking to reclaim their homeland from the dragon Smaug. Throughout the journey, Bilbo encounters trolls, elves, giant spiders, and more, ultimately discovering his own bravery and resourcefulness.', 
          (SELECT id FROM authors WHERE name = 'J.R.R. Tolkien'), 
          (SELECT id FROM categories WHERE name = 'Fantasy'),
          'https://covers.shakespeareandcompany.com/97802611/9780261103344.jpg'),

        ('1984', 
          '1984, written by George Orwell, is a dystopian novel set in a totalitarian society ruled by the Party and its leader, Big Brother. The story follows Winston Smith, a man who begins to question the Party''s control and the reality presented to him. Orwell''s chilling depiction of surveillance, propaganda, and the loss of individuality has made 1984 a profound commentary on the dangers of totalitarianism.', 
          (SELECT id FROM authors WHERE name = 'George Orwell'), 
          (SELECT id FROM categories WHERE name = 'Science Fiction'),
          'https://m.media-amazon.com/images/I/61ZewDE3beL._AC_UF894,1000_QL80_.jpg')
          `);

      console.log("Books inserted.");
    } else {
      console.log("Books table not empty.");
    }
  } catch (err) {
    console.error("Error inserting books:", err.stack);
  } finally {
    client.release();
  }
};

module.exports = {
  createTables,
  insertBooksIfEmpty,
};
