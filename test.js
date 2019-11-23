var csvParser = require('csv-parse');
var mysql = require('mysql');
var fs= require('fs');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "feedback_system"
});
var das=[];
fs.readFile("./note.csv", {
  encoding: 'utf-8'
}, function(err, csvData) {
  if (err) {
    console.log(err);
  }

  csvParser(csvData, {
    delimiter: ',',
	skip_empty_lines: true
  }, function(err, data) {
    if (err) {
      console.log(err);
    } else {
        con.connect(function(err) {
if (err) throw err;
console.log("Connected!");
var sql = "INSERT INTO branches_meta (branch, year, stream, section) VALUES ?";
con.query(sql, [data.slice(1)], function (err, result) {
	if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
	});
	con.end();
});
    }
	
  });
  
});


