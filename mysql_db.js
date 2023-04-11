const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'iotman'
});
 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);

  // connection.query('SELECT * from iotman.devices', function (error, results, fields) {
  //   if (error) throw error;
  //   console.log('The devices are: ', results);
  // })
});

// export default { connection };
// module.exports = { connection };
