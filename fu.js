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

function createTableQuery(tableName, parameterString) {

   con.query(`CREATE TABLE ${tableName} ${parameterString}`, (err, result) => {
       if(err) throw err;
       console.log(tableName, ' table created!');
   })
}

function execquery(quer) {

   con.query(quer, (err, result) => {
       if(err) throw err;
       console.log(quer.split()[2],quer.split()[1], ' created!');
   })
}
createTableQuery('questions_lab', `(sno int auto_increment Primary key, question varchar(255))`);
createTableQuery('questions_subject', `(sno int auto_increment Primary key, question varchar(255))`);
execquery("INSERT INTO `questions_lab` (`sno`, `question`) VALUES (NULL, 'Was the selection of experiment commensurate with the theory?'), (NULL, 'Was the experiment leading towards proper conclusions or interpretations?'), (NULL,'Whether lab instructor helped you in understanding the experimental observations. Outcome and explaining the difficulties raised while performing the experiment?'), (NULL, 'Whether the experiment trigger you for any creative idea?'), (NULL, 'Whether experimental set-up was well maintained, fully operational & adequate?'), (NULL, 'Whether precise, updated & self explanatory lab manuals were provided?'), (NULL, 'Whether submission of experimental write-up was routine & repetitive?'), (NULL, 'Whether lab instructor does assessment of experiment regularly and gives feedback?'), (NULL, 'Whether the entire lab session was useful in clarifying you knowledge of the theory?'),(NULL, 'Whether you are confident with the use of the concepts, instruments and their\r\napplication in further studies?')");
execquery("INSERT INTO `questions_subject` (`sno`, `question`) VALUES (NULL, 'Whether the lectures were well prepared, organized and course material is well structured?'), (NULL, 'Was the Blackboard writing / audio visual aids are clear and organized?'), (NULL, 'Were the lectures delivered with emphasis on fundamental concepts and with illustrative examples?'), (NULL, 'Whether the Teacher engages classes regularly & maintains the discipline?'), (NULL,'Whether difficult topics were taught with adequate attention and ease?'),(NULL, 'Did the Faculty provide you new knowledge and has command over the subject?'), (NULL, 'Was the instructor enthusiastic about teaching?'), (NULL,'Was the teacher able to deliver lectures with good communication skills?'),(NULL, 'Were you encouraged to ask Questions, to make lectures interactive and lively?'), (NULL, 'Did the course improve your understanding of concepts, principles in this field and motivated you to think and learn?'), (NULL,'Whether the teacher was effective in preparing students for exams?'), (NULL,'Were the unit / assignment tests challenging?'), (NULL, 'Was the evaluation fair and Impartial? and did it help you to improve?'), (NULL, 'Did teacher give additional technical / non-technical inputs by referring to Internet/ additional books?'), (NULL, 'Whether teacher was always accessible to the students for counseling, guidance and solving queries off the classroom hours.')");
