const express = require('express');
const db = require('./app');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/todos', (req, res) => {
    const sql = 'select * from todo';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send({ error: 'Something failed!' })
        }

        if (!results.length) {
            res.status(404).send({ error: 'Todos not found' });
        } else {
            res.status(200);
            res.json(results)
        }
    });
});

app.post('/todos', (req, res) => {
    const title = req.body.title;
    const sql = `insert into todo (title) values ('${title}')`;

    db.query(sql, (err, results) => {
        if (err) {
            console.log(sql)
            res.status(500).send({ error: 'Something failed!' })
        }

        if (!title || !title.length) {
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

app.put('/todo/:id', (req, res) => {
    const id = req.params.id;
    const sql = `update todo set flag=1 where id=${id}`;

    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send({ error: 'Something failed' });
        }

        if (!results.affectedRows) {
            res.status(404).send({ error: 'Todo not found' })
        } else {
            res.status(204);
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
    });
});

app.listen(3000, function () { });
