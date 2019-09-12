const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'todoDB'
});
// queries
const insert = "INSERT INTO todo (`title`, `flag`, `status`) VALUES ('Initialize the database', '0', CURRENT_TIMESTAMP)";
const selectAll = "SELECT * FROM todo";
const selectLast = "SELECT * FROM todo WHERE id=?";
const changeStatus = "UPDATE todo SET flag=1 where id=?";
const remove = "DELETE FROM todo WHERE id=?";

connection.connect((error) => {
  if (error) throw error;
  console.log('Conected');
});

const insertTodo = () => {
  return new Promise((resolve, reject) => {
    connection.query(insert, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results.insertId);
    });
  });
};

const selectAllTodos = () => {
  connection.query(selectAll, (error, results) => {
    if (error) throw error;
    console.log('All records:');
    console.log(results);
  });
};

const selectLastTodo = (lastAddedTodoId) => {
  connection.query(selectLast, lastAddedTodoId, (error, results) => {
    if (error) throw error;
    console.log('Last added record:');
    console.log(results);
  });
};

const changeTodoStatus = (lastAddedTodoId) => {
  connection.query(changeStatus, lastAddedTodoId, (error, results) => {
    if (error) throw error;
    console.log(`Number of changed rows: ${results.changedRows}`);
  });
};

const removeLastTodo = (lastAddedTodoId) => {
  connection.query(remove, lastAddedTodoId, (error, results) => {
    if (error) throw error;
    console.log(`Number of deleted rows: ${results.affectedRows}`);
  });
}

insertTodo()
  .then((id) => {
    selectAllTodos();
    return id;
  })
  .then((id) => {
    changeTodoStatus(id);
    return id;
  })
  .then((id) => {
    selectLastTodo(id);
    return id;
  })
  .then((id) => {
    removeLastTodo(id);
  })
  .then(() => {
    connection.end();
  });
