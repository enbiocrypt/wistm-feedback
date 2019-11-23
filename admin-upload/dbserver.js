const express = require('express')
const bodyParser= require('body-parser')
const session = require('express-session');
const app = express()
const multer = require('multer');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client  = redis.createClient();

app.use(session({
  secret: 'ssshhhhh',
  // create new redis store.
  store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
  saveUninitialized: false,
  resave: false
}));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/node_modules'));
var MySql = require('sync-mysql');
var connection = new MySql({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'newfeedbackdb'
});

var mysql = require('mysql');
var con = mysql.createConnection({
    host:'localhost',
    user: 'root',
    database:'newfeedbackdb',
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

app.get('/login', (req,res) => {
  res.sendFile(__dirname+"/login_admin.html");

});

app.post('/login', (req,res) => {
  userid = req.body.userid
  password = req.body.password
  
    con.connect(function(err) {
    if (err) throw err;
    con.query(`select userid FROM admins WHERE userid="${userid}" AND password="${password}"`, function (err, result, fields) {
      if (err) throw err;
    console.log(result,result.length)
    if(result.length!=0)
    {
      req.session.branch=result[0].userid;
      res.end("correct");

    }
    else{
      res.end("Wrong Credentials!! Please Re-Enter");
    }
    });
    con.end();
    });

    

});

app.post('/student',upload.single("file"),(req,res) => {
  stream = req.session.stream
  if(req.session.branch){
    branch = req.session.branch;
  var quer=`truncate table ${stream}${branch}`
  //CREATE TABLE ECSE (YEAR INT, SECTION INT, REGNO INT, NAME VARCHAR(255), ADHAAR INT);
  const file = req.file
  console.log(req.file)
  if (!file) {
    return res.end("Please Upload Correct File!!");
  }
  var jjj=[];
  var parser= parse({delimiter: ',',trim: true,
  skip_empty_lines: true}, function(error, data){
      if(error)
          throw error;
      data.forEach(function (record){
          if (record.length > 0){
              jjj.push(record.concat([0]));
              console.log(record);

          }
        }
      )
      }
  );

  fs.createReadStream(file.path).pipe(parser).on("end", () => {
    console.log(jjj);
    console.log(file.originalname);
    connection.query(quer);
    insertMultipleIntoTable(`${stream}${branch}`, jjj.slice(1,));
    //insertMultipleIntoTable('revies',jjj);
    res.send("Successfully uploaded");

  });
    
}
});

app.post('/student/:typeId', (req,res) => {
req.session.stream=req.params.typeId;
res.end('Done')
});

app.get('/upinter', (req,res) => {
	if(req.session.branch)
		res.sendFile(__dirname+"/upinter.html");
	else
		res.sendFile(__dirname+"/login_admin.html");
});

app.post('/subjects',upload.single("file"),(req,res) => {
  if(req.session.branch && req.session.stream){
    branch = req.session.branch;
    stream = req.session.stream;
  var quer=`delete from REVIEWSREPORT WHERE STREAM=${stream} AND BRANCH=${branch}`
  //CREATE TABLE ECSE (YEAR INT, SECTION INT, REGNO INT, NAME VARCHAR(255), ADHAAR INT);
  const file = req.paramaters.file;
  if (!file) {
    return res.end("Please Upload Correct File!!");
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
    connection.query(quer);
	
	subdata=[]
	jjj.slice(1,).forEach(x => {
	sid = x[0]+x[1]+String(x[2])+String(x[3])+x[4]+x[7];
	secid = x[0]+x[1]+String(x[2])+String(x[3]);
	k = [sid, secid].concat(x).concat([0]);
	subdata.push(k);
	})
    insertMultipleIntoTable(`REVIEWSREPORT`, subdata);
    //insertMultipleIntoTable('revies',jjj);
  });
    res.send("Successfully uploaded");
}
});


app.get('/',function(req,res){
  res.sendFile(__dirname + '/login_admin.html');

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
    insertMultipleIntoTable('reviewsreport', jjj.slice(1,));
    //insertMultipleIntoTable('revies',jjj);
  });
    res.send(file);

});
app.listen(5000)