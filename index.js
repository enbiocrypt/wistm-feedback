const express = require('express'),
     http = require('http');
const session = require('express-session');
const bodyParser = require('body-parser');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client  = redis.createClient();
const app = express();

const hostname = 'localhost';
port = process.env.PORT || 3000;

app.set('view engine','ejs');
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

app.use(session({
    secret: 'ssshhhhh',
    // create new redis store.
    store: new redisStore({ host: 'localhost', port: 6379, client: client, disableTTL: true}),
    saveUninitialized: false,
    resave: false
}));


app.get('/',(req,res) => {
    let sess = req.session;
	if(req.session.regId){
    res.render('feedbackForm',{'name':req.session.nameId,'subjects_f':req.session.subjects_f});
	}
	else{
	res.sendFile('index.html');}
});

app.get('/login',(req,res) => {
	if(req.session.regId){
		res.render('feedbackForm',{'name':req.session.nameId,'subjects_f':req.session.subjects_f});
	}
	else if(req.session.branchId){
	res.render('login',{'stream' :req.session.streamId , 'branch' :req.session.branchId, 'year' : req.session.yearId})
	}
	else{
	res.sendFile(__dirname+'/Public/index.html');
	}
});

app.post('/login',(req,res) => {
	var mysql = require('mysql');
	var con = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "",
		database: "newfeedbackdb"
		});
	var dict = {};
	if(req.session.branchId){
	con.connect(function(err) {
	if (err) throw err;
	con.query("select name,submitted FROM "+req.session.streamId[0]+req.session.branchId+" WHERE ROLL_NUMBER='"+req.body.regno+"' AND Aadhaar='"+req.body.adhno+"'", function (err, result, fields) {
    if (err) throw err;
	console.log(result,result.length)
	if(result.length!=0)
	{
		if(result[0].submitted==0){
		req.session.nameId=result[0].name;
		req.session.regId=req.body.regno;
		res.end("correct");}
		else{
			res.end("You've already submitted the reviews, Don't waste your Time!!")
		}
	}
	else{
		res.end("Wrong Credentials!! Please Re-Enter");
	}
	});
	con.end();
	});
	
	}
});


app.get('/stream', (req,res,next) => {
	var mysql = require('mysql');
	var con = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "",
		database: "newfeedbackdb"
		});
	var dict = {};
	if(req.session.regId){
    res.render('feedbackForm',{'name':req.session.nameId,'subjects_f':req.session.subjects_f});
	}
	if(req.session.streamId){
		if(req.session.streamId=="Engineering"){
	con.connect(function(err) {
	if (err) throw err;
	con.query('select b.branch, r.years, s.numberofsections as sections from sections s, branches b, streams r where s.streamid=r.id and s.branch=b.branch and r.id="E"', function (err, result, fields) {
    if (err) throw err;
	for(var i=0;i<result.length;i++){
		dict[result[i].branch]=[result[i].years,result[i].sections];
	}
	res.render('stream', {'data' :dict , 'stream' :"Engineering"});
	});
	con.end();
	});
		}
		else if(req.session.streamId=="Diploma"){
	con.connect(function(err) {
	if (err) throw err;
	con.query('select b.branch, r.years, s.numberofsections as sections from sections s, branches b, streams r where s.streamid=r.id and s.branch=b.branch and r.id="D"', function (err, result, fields) {
    if (err) throw err;
	for(var i=0;i<result.length;i++){
		dict[result[i].branch]=[result[i].years,result[i].sections];
	}
	res.render('stream', {'data' :dict , 'stream' :"Diploma"});
	});
	con.end();
	});
		}
		else{
			res.sendFile(__dirname+'/Public/index.html');
		}
	}
	else{
		res.sendFile(__dirname+'/Public/index.html');
	}

});

app.get('/stream/:streamId',(req,res) => { 
	if(req.session.regId){
    res.render('feedbackForm',{'name':req.session.nameId,'subjects_f':req.session.subjects_f});
	}
	req.session.streamId=req.params.streamId;
    console.log(req.session.streamId);
	res.end('done');
});

app.get('/feedbackForm',(req,res) => {
	var mysql = require('mysql');
	var con = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "",
		database: "newfeedbackdb"
		});
	var dict = {};
	if(req.session.subjects_f==undefined && req.session.regId){
		console.log("feed1");
	
	con.connect(function(err) {
	if (err) throw err;
	con.query('select c.subcode, f.name, c.type from reviewsreport c, faculty f where c.facultyid = f.id and c.secid="'+req.session.branchId+req.session.streamId[0]+req.session.yearId+req.session.sectionId+'"', function (err, result, fields) {
    if (err) throw err;
	for(var i=0;i<result.length;i++){
		dict[i]=[result[i].subcode,result[i].name,result[i].type];
	}
	res.render('feedbackForm',{'name':req.session.nameId,'subjects_f':dict});
	});
	con.end();
	});
	}
	else if(req.session.subjects_f){
    res.render('feedbackForm',{'name':req.session.nameId,'subjects_f':req.session.subjects_f});
	}
	else{
		console.log("feed2");
		res.sendFile(__dirname+'/Public/index.html');
	}
});

app.get('/feedbackForm/:feedsId', (req,res,next) => {
	if(req.params.feedsId=="sub"){
	if(req.session.sub){
		console.log(req.params.feedsId,req.session.sub);
		res.end(JSON.stringify({ sub: req.session.sub }));
		}
	else{
		console.log(req.params.feedsId);
		res.end(JSON.stringify({ sub: [] }));
		}
	}
	else if(req.params.feedsId=="idd"){
		if(req.session.idd){
		console.log(req.params.feedsId);
		res.end(JSON.stringify({ idd: req.session.idd }));
		}
		else{
			console.log(req.params.feedsId);
			req.session.idd=0;
			res.end(JSON.stringify({ idd: req.session.idd }));
		}
	}
    
});

app.post('/feedbackForm/:feedsId',(req,res) => { 
	if(req.params.feedsId=="submore"){
		if(req.session.subjects_f){
			res.end(JSON.stringify(req.session.qc));
		}
		else{
			console.log(req.body);
			var dict=[[],[]];
		function get_info(callback){
			var mysql = require('mysql');
			var con = mysql.createConnection({
			host: "localhost",
			user: "root",
			password: "",
			database: "newfeedbackdb"
			});
			req.session.subjects_f=req.body.subjects_f;
			con.connect(function(err) {
			if (err) throw err;
			con.query('SELECT a.question as subjects, b.question as lab FROM questions_subject a LEFT JOIN questions_lab b ON a.sno=b.sno', function (err, result, fields) {
			if (err) throw err;
			for(var i=0;i<result.length;i++){
				if(result[i].subjects)
					dict[0].push(result[i].subjects);
				if(result[i].lab)
					dict[1].push(result[i].lab);
			}
			return callback(dict);
				});
				con.end();
			});
		}
		get_info(function(result){
			console.log("Start");
			console.log(result);
			return res.end(JSON.stringify(result));
			console.log("end");
			});

		}
		console.log("Dinesh check");
	}
	else if(req.params.feedsId=="subqore"){
		if(req.session.qc)
			res.end("Done");
		else{
		req.session.qc=req.body.qc;
		console.log("End--")
		console.log(req.session.qc);
		res.end("Done");
		}
	}
	else if(req.params.feedsId=="request_all"){
		res.end(req.session.branchId+req.session.streamId[0]+req.session.yearId+req.session.sectionId);
	}
	else if(req.params.feedsId=="final_all"){
		req.session.review=req.body.op;
		console.log(req.session.review.S);
		var mysql = require('mysql');
		var con = mysql.createConnection({
		host:'localhost',
		user: 'root',
		database:'newfeedbackdb',
		password: ''
		});

		con.connect(err => {
		if(err) throw err;
		});
		
		function insertMultipleIntoTable(tableName, data) {
		con.query(`INSERT INTO ${tableName} VALUES ?`, [data], (err, result) => {
        if (err) throw err;
        console.log("Number of records inserted into "+ tableName + ' table : ' + result.affectedRows);
			});
		}
		
		function insertMultipleIntoTable(tableName, data) {
		con.query(`INSERT INTO ${tableName} VALUES ?`, [data], (err, result) => {
        if (err) throw err;
        console.log("Number of records inserted into "+ tableName + ' table : ' + result.affectedRows);
			});
		}
		
		insertMultipleIntoTable('sreviews',req.session.review.S);
		insertMultipleIntoTable('lreviews',req.session.review.L);
		
		
		con.query('UPDATE '+req.session.streamId[0]+req.session.branchId+' SET submitted = 1 WHERE ROLL_NUMBER = '+req.session.regId+';', function (err, result, fields) {
			if (err) throw err;
		});
		
		con.end();
		
		req.session.destroy();
		
		res.end("done");
		
		/*
		var mysql = require('mysql');
			var con = mysql.createConnection({
			host: "localhost",
			user: "root",
			password: "",
			database: "feedbackdb"
			});
			req.session.subjects_f=req.body.subjects_f;
			con.connect(function(err) {
			if (err) throw err;
			con.query('SELECT a.question as subjects, b.question as lab FROM questions_subject a LEFT JOIN questions_lab b ON a.sno=b.sno', function (err, result, fields) {
			if (err) throw err;
			for(var i=0;i<result.length;i++){
				if(result[i].subjects)
					dict[0].push(result[i].subjects);
				if(result[i].lab)
					dict[1].push(result[i].lab);
			}
			return callback(dict);
				});
				con.end();
			});
		*/
	}
	else{
	req.session.idd=parseInt(req.params.feedsId);
    console.log(req.session.sub, req.body);
	res.end("Done");
	}
});

app.post('/feedbackForm',(req,res) => { 
    req.session.sub = req.body.sub;
    console.log(req.session.sub, req.body);
	res.end("Done");
});

app.post('/stream',(req,res) => { 
	req.session.branchId=req.body.branch;
	req.session.yearId=req.body.year;
	req.session.sectionId=req.body.section;
    console.log(req.session);
	res.end("Done");
});

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

/*
streamId

*/