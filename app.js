const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'todoDB'
});

async function connect() {
  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) reject(err);
      else {
        console.log('Conected');
        resolve();
      }
    });
  });
};

async function execute(sql, params = []) {
  return new Promise((reslove, reject) => {
    connection.query(sql, params, (err, results, fields) => {
      if (err) reject(err);
      else reslove({ results, fields });
    });
  });
};

function formatResults({ results, fields }) {
  return results.map(row => fields.map(field => `${field.name}: ${row[field.name]}`).join(', ')).join('\n');
}

async function init() {
  await connect();
  const newId = (await execute('insert into todo (title) values (?)', [ 'Node is awesome' ])).results.insertId;
  console.log(formatResults(await execute('select * from todo')));
  console.log('Number of changed rows: ' , (await execute('update todo set flag=1 where id=?', [newId])).results.changedRows);
  console.log(formatResults(await execute('select * from todo where id=?', [newId])));
  console.log('Number of deleted rows: ' , (await execute('delete from todo where id=?', [newId])).results.affectedRows);
  connection.end();
}

// init();

module.exports = connection;
