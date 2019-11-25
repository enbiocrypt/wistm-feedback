const express = require('express'),
     http = require('http');
const session = require('express-session');
const bodyParser = require('body-parser');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const hostname = 'localhost';
port = process.env.PORT || 3000;

client  = redis.createClient(6380, 'enbiocrypt.redis.cache.windows.net', 
        {auth_pass: 'pQANwbSPqEA0rHqOpDznzOhJeb9sqyzWbZLWo6W5oZc=', tls: {servername: 'enbiocrypt.redis.cache.windows.net'}});
const app = express();


app.set('view engine','ejs');
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/static'));

app.use(session({
    secret: 'ssshhhhhhhh',
    // create new redis store.
    store: new redisStore({client: client, disableTTL: true}),
    saveUninitialized: false,
    resave: false
}));

app.get('/reviews',(req,res) => {
	if(req.session.mainadmin){
	var mysql = require('mysql');
	var con= mysql.createConnection({host: "enbiocrypt.mysql.database.azure.com", user: "enbiocrypt@enbiocrypt", password: "25aprial1998QQ!!", database: "newfeedbackdb", port: 3306});
    var MySql = require('sync-mysql');
	var connection = new MySql({host: "enbiocrypt.mysql.database.azure.com", user: "enbiocrypt@enbiocrypt", password: "25aprial1998QQ!!", database: "newfeedbackdb", port: 3306});
	type = req.query.type;
    id = req.query.id;
    console.log(id,type);
    data = {}

    if (type === 'S'){
        quer = `SELECT avg(r.Q1), avg(r.Q2), avg(r.Q3), avg(r.Q4), avg(r.Q5), avg(r.Q6), avg(r.Q7), avg(r.Q8), avg(r.Q9), avg(r.Q10), avg(r.Q11), avg(r.Q12), avg(r.Q13), avg(r.Q14), avg(r.Q15), s.subname,f.name FROM sreviews r, faculty f, reviewsreport s where r.sid="${id}" and r.sid=s.sid and s.facultyid=f.id`;
        data.questions = connection.query('select * from questions_subject');
    }
    else if(type === 'L'){
        quer = `SELECT avg(r.Q1), avg(r.Q2), avg(r.Q3), avg(r.Q4), avg(r.Q5), avg(r.Q6), avg(r.Q7), avg(r.Q8), avg(r.Q9), avg(r.Q10), s.subname,f.name FROM lreviews r, faculty f, reviewsreport s where r.sid="${id}" and r.sid=s.sid and s.facultyid=f.id`;
        data.questions = connection.query('select * from questions_lab');

    }

    console.log(data);
    
    con.query(quer, (err, result, fields) => {
        values = Object.values(result[0]);
        console.log(result);
        data.name = result[0].name;
        data.subname = result[0].subname;
        if (values[0]){
            
            sum = values.slice(0,-2).reduce((a,b) => a+b, 0)
            average = (sum/values.slice(0,-2).length).toFixed(1);
            data.average = average;
            console.log('average: ', average, '/5');
            
            values = values.slice(0,-2).map(x => parseFloat(x.toFixed(1)))
            data.values = values;
            
            console.log(data);
            
            res.render('individualReview',{data:data});
        }
        else {
            res.send(`subject ${req.query.id} not exist`);
        }

        
    });
	}else{
		res.sendFile(__dirname+'/static/admin_main_login.html');
	}
	
    
});

app.get('/ajax/series', function(request, response) {
	if(request.session.mainadmin){
	var MySql = require('sync-mysql');
	var connection = new MySql({host: "enbiocrypt.mysql.database.azure.com", user: "enbiocrypt@enbiocrypt", password: "25aprial1998QQ!!", database: "newfeedbackdb", port: 3306});
	
    quer = ' select a.branch as name, name as bname, avg(average) as y  from reviewsreport a, branches b where a.branch=b.branch group by (a.branch)';

    var branches = connection.query(quer);

    branches.forEach(x => {
        x.bartitle = x.name;
        x.drilldown = x.name;
        x.y =  parseFloat(x.y.toFixed(1));
        x.description = 'Branch';

    })
    var sections = []
    var sectionslist = []
    branches.forEach(x => {
        k = {
            'id':x.name,

        }
        quer = `select secid as name,avg(average) as y, year, section from reviewsreport where branch='${x.name}' group by (secid)`;
        var ress = connection.query(quer);
        ress.forEach(x => {
            x.y =  parseFloat(x.y.toFixed(1));
            x.description = "Section";
            x.bartitle = `${x.name.slice(0,-3)} year ${x.year}`;
            if (x.section >1){
                x.bartitle= x.bartitle+`section ${x.section}`;
            }
            
            x.drilldown = x.name;
        })
        k.data = ress;
        sections.push(k);
        
        ress.forEach(x => {
            sectionslist.push(x.name);
        })
    });

    subjects = []

    sectionslist.forEach(x => {
        k = {'id':x}
        quer = `SELECT SID AS name, AVERAGE as y, type, subname FROM reviewsreport WHERE SECID="${x}"`;
        var ress = connection.query(quer);
        ress.forEach(x => {
            x.y =  parseFloat(x.y.toFixed(1));
            x.description = "Subject";
            x.bartitle = x.subname;
            x.link = `/reviews?id=${x.name}&type=${x.type}`;
            x.name = x.bartitle;
        })
        k.data = ress;
        subjects.push(k);
    });


    output = {}
    output.data = branches;
    output.series = sections.concat(subjects);
    
    response.json(output);
    //console.log(output);
}
else{
res.sendFile(__dirname+'/static/admin_main_login.html');
}
}

);

app.get('/main_admin_panel',(req,res) => {
	if(req.session.mainadmin){
	res.render('review_analysis');
	}
	else{
	res.sendFile(__dirname+'/static/admin_main_login.html');
	}
});

app.get('/main_admin_login',(req,res) => {
	if(req.session.mainadmin){
		res.render('review_analysis');
	}
	else{
	res.sendFile(__dirname+'/static/admin_main_login.html');
	}
});

app.post('/main_admin_login', (req,res) => {
  if(req.session.mainadmin){
  res.render('review_analysis');}
  else{
  userid = req.body.userid
  password = req.body.password
  var mysql = require('mysql');
  var con= mysql.createConnection({host: "enbiocrypt.mysql.database.azure.com", user: "enbiocrypt@enbiocrypt", password: "25aprial1998QQ!!", database: "newfeedbackdb", port: 3306});
    con.connect(function(err) {
    if (err) throw err;
    con.query(`select userid FROM mainadmin WHERE userid="${userid}" AND password="${password}"`, function (err, result, fields) {
      if (err) throw err;
    console.log(result,result.length)
    if(result.length!=0)
    {
      req.session.mainadmin=result[0].userid;
      res.end("correct");
    }
    else{
      res.end("Wrong Credentials!! Please Re-Enter");
    }
    });
    con.end();
    });
  }
});

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
	var con= mysql.createConnection({host: "enbiocrypt.mysql.database.azure.com", user: "enbiocrypt@enbiocrypt", password: "25aprial1998QQ!!", database: "newfeedbackdb", port: 3306});
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
	var con= mysql.createConnection({host: "enbiocrypt.mysql.database.azure.com", user: "enbiocrypt@enbiocrypt", password: "25aprial1998QQ!!", database: "newfeedbackdb", port: 3306});
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
	var con= mysql.createConnection({host: "enbiocrypt.mysql.database.azure.com", user: "enbiocrypt@enbiocrypt", password: "25aprial1998QQ!!", database: "newfeedbackdb", port: 3306});
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
			var con= mysql.createConnection({host: "enbiocrypt.mysql.database.azure.com", user: "enbiocrypt@enbiocrypt", password: "25aprial1998QQ!!", database: "newfeedbackdb", port: 3306});
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
		var con= mysql.createConnection({host: "enbiocrypt.mysql.database.azure.com", user: "enbiocrypt@enbiocrypt", password: "25aprial1998QQ!!", database: "newfeedbackdb", port: 3306});

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