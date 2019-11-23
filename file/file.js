const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const multer = require('multer');

var MySql = require('sync-mysql');
var connection = new MySql({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'feedbackdb'
});

var mysql = require('mysql');
var con = mysql.createConnection({
    host:'localhost',
    user: 'root',
    database:'feedbackdb',
    password: ''
});

//fs = require('fs-extra')
app.use(bodyParser.urlencoded({extended: true}))


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname)
  }
})

var upload = multer({ storage: storage })

var  parse = require('csv-parse');
var fs = require('fs');

function insertMultipleIntoTable(tableName, data) {
  con.query(`INSERT INTO ${tableName} VALUES ?`, [data], (err, result) => {
      if (err) throw err;
      console.log("Number of records inserted into "+ tableName + ' table : ' + result.affectedRows);
  });
}



app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html');

});

// upload single file

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)

  }
  var jjj=[];
  var parser= parse({delimiter: ',',trim: true,
  skip_empty_lines: true}, function(error, data){
      if(error)
          throw error;
      data.forEach(function (record){
          if (record.length > 0){
              jjj.push(record);
              console.log(record);
              
          }
        }
      )
      }
  );
      
  fs.createReadStream(file.path).pipe(parser).on("end", () => {
    console.log(jjj);
    console.log(file.originalname);
    connection.query("truncate table faculty");
    insertMultipleIntoTable('faculty', jjj);    
    //insertMultipleIntoTable('faculty',jjj);
  });
    res.send(file);
 
});
app.listen(5000)