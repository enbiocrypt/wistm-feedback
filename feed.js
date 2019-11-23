var mysql = require('mysql');
var con = mysql.createConnection({
    host:'localhost',
    user: 'root',
    database:'feedbackdb',
    password: ''
});

con.connect(err => {
    if(err) throw err;
});


function createTableQuery(tableName, parameterString) {

    con.query(`CREATE TABLE ${tableName} ${parameterString}`, (err, result) => {
        if(err) throw err;
        console.log(tableName, ' table created!');
    })
}


function insertMultipleIntoTable(tableName, data) {
    con.query(`INSERT INTO ${tableName} VALUES ?`, [data], (err, result) => {
        if (err) throw err;
        console.log("Number of records inserted into "+ tableName + ' table : ' + result.affectedRows);
    });
}

createTableQuery('branches','(branch VARCHAR(100) primary key, name VARCHAR(100))');
insertMultipleIntoTable('branches',[
    ['CSE', 'Computer Science Engineering'],
    ['ECE', 'Electronics and Communications Engineering'],
    ['EEE', 'Electrical and Electronics Engineering'],
    ['CIVIL', 'Civil Engineering'],
    ['MECH', 'Mechanical Engineering']
]);

createTableQuery('streams','(id CHAR(1) PRIMARY KEY, name VARCHAR(50), years INTEGER)');
insertMultipleIntoTable('streams', [['E','Engineering',4],['D','Diploma',3]]);

createTableQuery('sections',`(branch VARCHAR(100) REFERENCES branches(branch),
                            streamid CHAR(1) REFERENCES streams(id),
                            numberofsections INTEGER)`);
insertMultipleIntoTable('sections', [
    ['CSE','E',1],
    ['ECE','E',1],
    ['ECE','D',1],
    ['EEE','E',1],
    ['EEE','D',1],
    ['CIVIL','E',1],
    ['CIVIL','D',1],
    ['MECH','E',2],
    ['MECH','D',1]
]);

createTableQuery('sectionstable',`(id VARCHAR(300),branch VARCHAR(100) REFERENCES branches(branch),
                            streamid CHAR(1) REFERENCES streams(id),
                            year INTEGER, section INTEGER)`);
insertMultipleIntoTable('sectionstable', [ [ 'CSEE41', 'CSE', 'E', 4, 1 ],
[ 'CSEE31', 'CSE', 'E', 3, 1 ],
[ 'CSEE21', 'CSE', 'E', 2, 1 ],
[ 'CSEE11', 'CSE', 'E', 1, 1 ],
[ 'ECEE41', 'ECE', 'E', 4, 1 ],
[ 'ECEE31', 'ECE', 'E', 3, 1 ],
[ 'ECEE21', 'ECE', 'E', 2, 1 ],
[ 'ECEE11', 'ECE', 'E', 1, 1 ],
[ 'ECED31', 'ECE', 'D', 3, 1 ],
[ 'ECED21', 'ECE', 'D', 2, 1 ],
[ 'ECED11', 'ECE', 'D', 1, 1 ],
[ 'EEEE41', 'EEE', 'E', 4, 1 ],
[ 'EEEE31', 'EEE', 'E', 3, 1 ],
[ 'EEEE21', 'EEE', 'E', 2, 1 ],
[ 'EEEE11', 'EEE', 'E', 1, 1 ],
[ 'EEED31', 'EEE', 'D', 3, 1 ],
[ 'EEED21', 'EEE', 'D', 2, 1 ],
[ 'EEED11', 'EEE', 'D', 1, 1 ],
[ 'CIVILE41', 'CIVIL', 'E', 4, 1 ],
[ 'CIVILE31', 'CIVIL', 'E', 3, 1 ],
[ 'CIVILE21', 'CIVIL', 'E', 2, 1 ],
[ 'CIVILE11', 'CIVIL', 'E', 1, 1 ],
[ 'CIVILD31', 'CIVIL', 'D', 3, 1 ],
[ 'CIVILD21', 'CIVIL', 'D', 2, 1 ],
[ 'CIVILD11', 'CIVIL', 'D', 1, 1 ],
[ 'MECHE41', 'MECH', 'E', 4, 1 ],
[ 'MECHE31', 'MECH', 'E', 3, 1 ],
[ 'MECHE21', 'MECH', 'E', 2, 1 ],
[ 'MECHE11', 'MECH', 'E', 1, 1 ],
[ 'MECHE42', 'MECH', 'E', 4, 2 ],
[ 'MECHE32', 'MECH', 'E', 3, 2 ],
[ 'MECHE22', 'MECH', 'E', 2, 2 ],
[ 'MECHE12', 'MECH', 'E', 1, 2 ],
[ 'MECHD31', 'MECH', 'D', 3, 1 ],
[ 'MECHD21', 'MECH', 'D', 2, 1 ],
[ 'MECHD11', 'MECH', 'D', 1, 1 ] ]
);


createTableQuery('faculty','(id varchar(100) PRIMARY KEY, name VARCHAR(100), branch VARCHAR(100) REFERENCES branch)');
insertMultipleIntoTable('faculty', [
    ['f1','faculty1','CSE'],
    ['f2','faculty2','CSE'],
    ['f3','faculty3','EEE'],
    ['f4','faculty4','EEE'],
    ['f5','faculty5','ECE'],
    ['f6','faculty6','CIVIL'],
    ['f7','faculty7','MECH'],
]);

createTableQuery('CSEE41','(id VARCHAR(300) PRIMARY KEY, subject varchar(100), name varchar(100), facultyid VARCHAR(100) REFERENCES faculty)');
insertMultipleIntoTable('CSEE41', [
    ['CSEE41AI','AI','Aritificial Intelligence','f1'],
    ['CSEE41ES','ES','Embedded Systems','f2'],
]);

createTableQuery('CSEE41AI','(Q1 INTEGER, Q2 INTEGER, Q3 INTEGER, Q4 INTEGER, Q5 INTEGER, Q6 INTEGER, Q7 INTEGER, Q8 INTEGER, Q9 INTEGER, Q10 INTEGER, Q11 INTEGER, Q12 INTEGER, Q13 INTEGER, Q14 INTEGER, Q15 INTEGER)');
insertMultipleIntoTable('CSEE41AI', [[4, 2, 1, 4, 4, 4, 0, 2, 1, 3, 2, 1, 4, 3, 0],
       [4, 2, 3, 3, 2, 2, 2, 4, 1, 0, 3, 0, 0, 1, 4],
       [3, 2, 4, 1, 1, 2, 4, 1, 4, 1, 3, 1, 1, 4, 4],
       [4, 0, 0, 0, 0, 1, 1, 4, 2, 4, 3, 1, 0, 0, 2],
       [3, 1, 1, 0, 0, 4, 0, 2, 0, 1, 0, 1, 4, 0, 3],
       [1, 0, 2, 0, 1, 4, 2, 1, 3, 4, 1, 4, 1, 4, 0],
       [3, 3, 4, 3, 3, 0, 4, 4, 2, 1, 1, 4, 2, 2, 0],
       [0, 3, 2, 2, 4, 3, 2, 1, 0, 4, 0, 1, 4, 4, 1],
       [3, 3, 2, 1, 2, 0, 4, 2, 4, 3, 2, 2, 1, 2, 1],
       [3, 2, 0, 0, 1, 3, 0, 3, 4, 3, 2, 1, 2, 4, 4],
       [0, 0, 0, 2, 0, 2, 3, 2, 4, 0, 3, 1, 1, 1, 0],
       [3, 3, 4, 1, 4, 0, 2, 2, 1, 3, 1, 0, 4, 3, 3],
       [4, 1, 2, 0, 3, 2, 4, 3, 2, 4, 0, 0, 0, 0, 0],
       [3, 3, 1, 3, 2, 1, 4, 3, 2, 4, 1, 2, 3, 0, 2],
       [2, 3, 2, 0, 4, 1, 4, 3, 2, 1, 3, 2, 3, 3, 3],
       [2, 4, 3, 4, 4, 4, 2, 2, 1, 4, 2, 4, 2, 1, 4],
       [1, 2, 0, 0, 4, 0, 1, 3, 4, 4, 3, 4, 3, 3, 4],
       [3, 4, 4, 4, 4, 3, 3, 3, 0, 2, 2, 2, 4, 1, 0],
       [0, 3, 2, 0, 3, 3, 1, 0, 1, 3, 2, 3, 2, 1, 3],
       [1, 2, 1, 0, 4, 3, 1, 3, 2, 3, 4, 2, 1, 4, 3],
       [3, 4, 0, 2, 3, 3, 4, 4, 1, 4, 4, 0, 1, 0, 2],
       [1, 0, 1, 2, 2, 2, 3, 0, 2, 3, 3, 0, 0, 4, 4],
       [1, 1, 3, 0, 4, 2, 2, 0, 2, 2, 3, 0, 1, 2, 4],
       [0, 4, 3, 3, 3, 2, 1, 4, 0, 1, 0, 2, 1, 4, 1],
       [0, 2, 2, 0, 2, 2, 1, 4, 2, 0, 3, 1, 2, 1, 3],
       [0, 3, 4, 0, 2, 1, 2, 0, 2, 0, 1, 0, 1, 4, 2],
       [0, 1, 0, 2, 1, 4, 3, 3, 2, 2, 2, 0, 1, 1, 0],
       [0, 4, 0, 0, 4, 2, 3, 1, 3, 4, 0, 4, 4, 4, 3],
       [3, 3, 4, 0, 0, 0, 1, 2, 3, 2, 3, 0, 4, 4, 3],
       [0, 0, 4, 1, 3, 1, 2, 0, 1, 2, 4, 1, 4, 3, 2],
       [1, 0, 3, 1, 2, 1, 1, 0, 4, 4, 1, 3, 1, 3, 0],
       [0, 0, 4, 3, 0, 3, 4, 4, 1, 4, 2, 1, 2, 4, 2],
       [1, 3, 4, 1, 2, 4, 1, 3, 0, 3, 0, 0, 4, 1, 3],
       [3, 2, 0, 4, 1, 4, 3, 1, 2, 1, 3, 0, 1, 1, 4],
       [2, 2, 0, 2, 0, 3, 3, 2, 4, 1, 2, 2, 0, 0, 3],
       [1, 0, 0, 3, 4, 1, 0, 2, 4, 3, 3, 0, 2, 2, 3],
       [0, 1, 0, 3, 0, 1, 3, 3, 3, 0, 4, 1, 0, 1, 1],
       [0, 1, 4, 4, 0, 0, 1, 4, 2, 3, 2, 4, 2, 2, 2],
       [3, 2, 1, 3, 1, 0, 1, 4, 3, 1, 4, 3, 4, 2, 2],
       [2, 4, 3, 0, 2, 3, 1, 4, 3, 4, 2, 3, 3, 3, 0],
       [2, 0, 1, 0, 3, 1, 1, 1, 4, 4, 2, 1, 3, 3, 2],
       [4, 4, 4, 1, 4, 0, 0, 4, 0, 2, 1, 0, 4, 3, 1],
       [3, 3, 0, 2, 0, 3, 0, 2, 1, 0, 4, 3, 4, 0, 4],
       [3, 3, 2, 1, 4, 2, 1, 1, 3, 0, 2, 1, 3, 3, 0],
       [3, 3, 3, 2, 3, 1, 0, 0, 4, 2, 4, 3, 1, 3, 1],
       [4, 4, 2, 2, 2, 2, 3, 4, 1, 0, 3, 0, 3, 2, 3],
       [0, 0, 2, 2, 3, 4, 1, 1, 1, 1, 0, 4, 2, 2, 3],
       [3, 2, 0, 0, 0, 3, 1, 1, 1, 2, 1, 3, 2, 0, 3],
       [2, 4, 0, 0, 1, 2, 1, 2, 1, 0, 0, 2, 4, 2, 3],
       [0, 0, 4, 0, 2, 1, 2, 3, 1, 4, 0, 0, 3, 2, 2],
       [4, 1, 1, 0, 3, 0, 2, 3, 4, 2, 1, 1, 3, 4, 1],
       [0, 0, 1, 3, 1, 3, 1, 3, 1, 4, 3, 3, 2, 0, 3],
       [3, 3, 3, 1, 4, 4, 4, 3, 4, 4, 1, 1, 0, 0, 3],
       [0, 0, 1, 3, 2, 2, 2, 2, 2, 1, 0, 1, 3, 0, 4],
       [4, 1, 0, 1, 4, 0, 1, 3, 0, 3, 1, 3, 2, 1, 3],
       [2, 3, 1, 3, 2, 1, 2, 4, 4, 3, 3, 4, 1, 1, 2],
       [2, 0, 1, 3, 4, 1, 2, 1, 2, 3, 4, 4, 2, 1, 3],
       [0, 3, 2, 2, 4, 0, 3, 0, 0, 2, 2, 1, 2, 1, 1],
       [2, 1, 3, 0, 4, 4, 0, 2, 0, 2, 0, 2, 2, 3, 2],
       [0, 3, 2, 0, 0, 2, 4, 1, 4, 3, 2, 4, 2, 1, 2]]
);



con.end();

/*query for getting subject and faculty details */
/*select c.subject, f.name from CSE4 c, faculty f where c.facultyid = f.id;*/

/*Don't consider from here */





/*

createTableQuery('sections',`(branch VARCHAR(100) REFERENCES branches(branch),
                            streamid CHAR(1) REFERENCES streams(id),
                            numberofsections INTEGER,
                            sectionid varchar(255) PRIMARY KEY)`);
branches= ["CSE", "ECE", "EEE", "MECH", "CIVIL"];
sections = [];
branches.forEach( x=> {
    a = []
        a.push(x);
    a.push('E');
    if (x !='MECH')
        a.push(1);
    else
        a.push(2);
    s = ''
    a.forEach( k => {
        s=s + String(k);
    })
    a.push(s);
    sections.push(a);
});

branches.forEach( x=> {
	if (x!=='CSE') {
    a = []
  	a.push(x);
    a.push('D');
    a.push(1);
    s = '';
    a.forEach( k => {
        s=s + String(k);
    })
    a.push(s);
    sections.push(a);}
});
insertMultipleIntoTable('sections', sections);
*/