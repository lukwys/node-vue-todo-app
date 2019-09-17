const express = require('express');
const db = require('./app');
const app = express();

app.get('/todos', (req, res) => {
    const sql = 'select * from todo';
    db.query(sql, function (err, results, fields) {
        if (err) {
            res.status(500).send({ error: 'Something failed!' })
        }
        res.status(200);
        res.json(results)
    })
});

app.post('/todos', (req, res) => {
    const title = req.query.title;
    const sql = `insert into todo (title) values ('${title}')`;

    db.query(sql, (err, results) => {
        if (err) {
            console.log(sql)
            res.status(500).send({ error: 'Something failed!' })
        }

        if (!title.length) {
            res.status(400).send({ error: 'Wrong data' })
        } else {
            res.status(201);
            res.json(results);
        }
    });
});

app.get('/todo/:id', (req, res) => {
    const id = req.params.id;
    const sql = `select * from todo where id=${id}`;

    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send({ error: 'Something failed!' })
        }

        if (!results.length) {
            res.status(404).send({ error: 'Todo not found' })
        } else {
            res.status(200);
            res.json(results);
        }
    });
});

app.delete('/todo/:id', (req, res) => {
    const id = req.params.id;
    const sql = `delete from todo where id=${id}`;

    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send({ error: 'Something failed!' })
        }

        if (!results.affectedRows) {
            res.status(404).send({ error: 'Todo not found' })
        } else {
            res.status(204);
        }
    })
})

app.listen(3000, function () { });
