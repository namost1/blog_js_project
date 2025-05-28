import express from 'express';
import * as db from './util/database.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.get('/blogs', (req, res) => {
    try {
        const blogs = db.getBlogs();
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});

app.get('/blogs/:id', (req, res) => {
    try {
        const blog = db.getBlog(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.status(200).json(blog);
    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});

app.post('/blogs', (req, res) => {
    try {
        const { author, title, category, content } = req.body;
        if (!author || !title || !category || !content) {
            return res.status(400).json({ message: 'Missing fields' });
        }
        const saved = db.saveBlog(author, title, category, content);
        res.status(201).json({ id: saved.lastInsertRowid, author, title, category, content });
    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});

app.put('/blogs/:id', (req, res) => {
    try {
        const { title, category, content } = req.body;
        if (!title || !category || !content) {
            return res.status(400).json({ message: 'Missing fields' });
        }
        const updated = db.updateBlog(req.params.id, title, category, content);
        if (updated.changes !== 1) {
            return res.status(404).json({ message: 'Update failed' });
        }
        res.status(200).json({ message: 'Update successful' });
    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});

app.delete('/blogs/:id', (req, res) => {
    try {
        const deleted = db.deleteBlog(req.params.id);
        if (deleted.changes !== 1) {
            return res.status(404).json({ message: 'Delete failed' });
        }
        res.status(200).json({ message: 'Delete successful' });
    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
