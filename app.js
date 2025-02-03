const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

// Buat koneksi ke database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Route untuk halaman utama
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

// Route untuk mendapatkan semua tasks
app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Route untuk menambahkan task
app.post('/tasks', (req, res) => {
    const { task } = req.body;
    db.query('INSERT INTO tasks (task) VALUES (?)', [task], (err, results) => {
        if (err) throw err;
        res.json({ id: results.insertId, task });
    });
});

// Route untuk mengupdate task
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { task } = req.body;
    db.query('UPDATE tasks SET task = ? WHERE id = ?', [task, id], (err, results) => {
        if (err) throw err;
        res.json({ id, task });
    });
});

// Route untuk menghapus task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tasks WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.json({ id });
    });
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});