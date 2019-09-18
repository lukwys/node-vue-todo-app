const express = require('express');
const db = require('./app');
const app = express();

app.use(express.json());

app.get('/todos', (req, res) => {
    const sql = 'select * from todo';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Something failed!' })
        }

        if (results.length === 0) {
            res.status(404).json({ error: 'Todos not found' });
        } else {
            res.status(200).json(results);
        }
    });
});

app.post('/todos', (req, res) => {
    const title = req.body.title;
    const sql = 'insert into todo (title) values (?)';

    db.query(sql, [title], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Something failed!' })
        }

        if (!title || title.length === 0) {
            res.status(400).json({ error: 'Wrong data' })
        } else {
            res.status(201).json(results);
        }
    });
});

app.get('/todo/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'select * from todo where id=?';

    db.query(sql, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Something failed!' })
        }

        if (results.length === 0) {
            res.status(404).json({ error: 'Todo not found' })
        } else {
            res.status(200).json(results[0]);
        }
    });
});

app.patch('/todo/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'update todo set flag=1 where id=?';

    db.query(sql, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Something failed' });
        }

        if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Todo not found' })
        } else {
            res.status(204).end();
        }
    });
});

app.delete('/todo/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'delete from todo where id=?';

    db.query(sql, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Something failed!' })
        }

        if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Todo not found' })
        } else {
            res.status(204).end();
        }
    });
});

app.listen(3000, function () { });
