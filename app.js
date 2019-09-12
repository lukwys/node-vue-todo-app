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

connection.beginTransaction((error) => {
  if (error) throw error;

  connection.query(insert, (error, results) => {
    if (error) {
      return connection.rollback(() => {
        throw error;
      })
    };

    console.log(`New id: ${results.insertId}`);

    const lastAddedRecordId = results.insertId;

    connection.query(selectAll, (error, results) => {
      if (error) throw error;
      console.log('All records:');
      console.log(results);
    });

    connection.query(selectLast, lastAddedRecordId, (error, results) => {
      if (error) throw error;
      console.log('Last added record:');
      console.log(results);
    });

    connection.query(changeStatus, lastAddedRecordId, (error, results) => {
      if (error) throw error;
      console.log("Changed record:");
      console.log(results);
    });

    connection.query(remove, lastAddedRecordId, (error, results) => {
      if (error) throw error;
      console.log(`Number of deleted rows: ${results.affectedRows}`);
    });

    connection.commit((error) => {
      if (error) {
        return connection.rollback(() => {
          throw error;
        });
      }
      console.log('success!');
    });
  });
});
