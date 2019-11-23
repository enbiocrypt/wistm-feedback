var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "feedback_system"
});

var dict = {};
con.connect(function(err) {
  if (err) throw err;
  con.query("select FirstSet.branch, FirstSet.years, SecondSet.sections from ( SELECT branch , MAX(year) as years from branches_meta where stream='ENG' GROUP BY branch ) as FirstSet inner join ( select branch, COUNT(DISTINCT(section)) as sections from branches_meta where stream='ENG' group by branch ) as SecondSet on FirstSet.branch = SecondSet.branch order by FirstSet.branch", function (err, result, fields) {
    if (err) throw err;
	for(var i=0;i<result.length;i++){
		dict[result[i].branch]=[result[i].years,result[i].sections];
	}
	console.log(dict);
  });
  con.end();
});
