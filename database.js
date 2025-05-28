import Database from "better-sqlite3"

const db = new Database('./data/database.sqlite')

db.prepare(`
CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT,
    title TEXT,
    category TEXT,
    content TEXT,
    createdAt TEXT,
    updatedAt TEXT
)`).run()

export const getBlogs = () => 
    db.prepare(`SELECT * FROM blogs`).all()

export const getBlog = (id) => 
    db.prepare(`SELECT * FROM blogs WHERE id = ?`).get(id)

export const saveBlog = (author, title, category, content) => {
    const now = new Date().toISOString()
    return db.prepare(`
        INSERT INTO blogs (author, title, category, content, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(author, title, category, content, now, now)
}

export const updateBlog = (id, title, category, content) => {
    const now = new Date().toISOString()
    return db.prepare(`
        UPDATE blogs
        SET title = ?, category = ?, content = ?, updatedAt = ?
        WHERE id = ?
    `).run(title, category, content, now, id)
}

export const deleteBlog = (id) =>
    db.prepare(`DELETE FROM blogs WHERE id = ?`).run(id)


const blogCount = db.prepare(`SELECT COUNT(*) AS count FROM blogs`).get().count

if (blogCount === 0) {
    const blogs = [
        { author: 'Anna', title: 'Első blog', category: 'Tech', content: 'Ez az első blogbejegyzés tartalma.' },
        { author: 'Béla', title: 'Második blog', category: 'Életmód', content: 'Ez a második blogbejegyzés tartalma.' },
        { author: 'Cecil', title: 'Harmadik blog', category: 'Utazás', content: 'Ez a harmadik blog tartalma.' },
        { author: 'Anna', title: 'Negyedik blog', category: 'Tech', content: 'Egy másik bejegyzés Annától.' },
        { author: 'Béla', title: 'Ötödik blog', category: 'Gasztronómia', content: 'Egy kis recept és gasztroélmény.' },
        { author: 'Cecil', title: 'Hatodik blog', category: 'Kultúra', content: 'Művészetekről és kultúráról.' }
    ]

    for (const blog of blogs) {
        saveBlog(blog.author, blog.title, blog.category, blog.content)
    }

    console.log("Tesztadatok beszúrva az adatbázisba.")
}
