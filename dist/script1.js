var questions = [
  {question:"Whether the lectures were well prepared, organized and course material is well structured?"},
  {question:"Was the Blackboard writing / audio visual aids are clear and organized?"},
  {question:"Were the lectures delivered with emphasis on fundamental concepts and with illustrative examples?"},
  {question:"Whether the Teacher engages classes regularly & maintains the discipline?"},
  {question:"Whether difficult topics were taught with adequate attention and ease?"},
  {question:"Did the Faculty provide you new knowledge and has command over the subject?"},
  {question:"Was the instructor enthusiastic about teaching?"},
  {question:"Was the teacher able to deliver lectures with good communication skills?"},
  {question:"Were you encouraged to ask Questions, to make lectures interactive and lively?"},
  {question:"Did the course improve your understanding of concepts, principles in this field and motivated you to think and learn?"},
  {question:"Whether the teacher was effective in preparing students for exams?"},
  {question:"Were the unit / assignment tests challenging?"},
  {question:"Were the"},
  {question:"Was the evaluation fair and Impartial? and did it help you to improve?"},
  {question:"Did teacher give additional technical / non-technical inputs by referring to Internet/ additional books?"},
  {question:"Whether teacher was always accessible to the students for counselling, guidance and solving queries off the classroom hours."}
]
var submission=[]

/**********

  !!!!!
  New Version: https://codepen.io/arcs/pen/rYXrNQ
  !!!!!
  
  Credits for the design go to XavierCoulombeM
  https://dribbble.com/shots/2510592-Simple-register-form
  
  This Pen uses no libraries except fonts and should 
  work on all modern browsers
  
  The answers are stored in the `questions` array
  with the key `value`. 

 **********/

;(function(){

  var tTime = 100  // transition transform time from #register in ms
  var wTime = 200  // transition width time from #register in ms
  var eTime = 1000 // transition width time from inputLabel in ms

  // init
  // --------------
  var position = 0


  putQuestion()

  progressButton.addEventListener('click', validate1)
  
  /*inputField.addEventListener('keyup', function(e){
    transform(0, 0) // ie hack to redraw
    if(e.keyCode == 13) validate()
  })
  */
  // functions
  // --------------

  function check(){
	  if(document.getElementById('star-1-2').checked){}
	  else if(document.getElementById('star-2-2').checked){}
	  else if(document.getElementById('star-3-2').checked){}
	  else if(document.getElementById('star-4-2').checked){}
	  else if(document.getElementById('star-5-2').checked){}
	  else{return false;}
	  return true;
	  
  }
  // load the next question
  function putQuestion() {
    inputLabel.innerHTML = questions[position].question
	if(document.getElementById('star-1-2').checked){
		submission.push(1);
		
	}
	else if(document.getElementById('star-2-2').checked){
		submission.push(2);
		document.getElementById('star-2-2').checked=false;
	}
	else if(document.getElementById('star-3-2').checked){
		submission.push(3);
		document.getElementById('star-3-2').checked=false;
	}
	else if(document.getElementById('star-4-2').checked){
		submission.push(4);
		document.getElementById('star-4-2').checked=false;
	}
	else if(document.getElementById('star-5-2').checked){
		submission.push(5);
		document.getElementById('star-5-2').checked=false;
	}
	console.log(submission,position);
    //inputField.value = ''
    //inputField.type = questions[position].type || 'text'  
    //inputField.focus()
    showCurrent()
  }
  
  // when all the questions have been answered
  function done() {
    
    // remove the box if there is no next question
    //register.className = 'close'
    
    // add the h1 at the end with the welcome text
    inputContainer.style.opacity = 1
    inputLabel.innerHTML='Thanks for your Submission..'
	document.getElementById('stars1').innerHTML="";
    //document.getElementById('sub1').style.display="none"
    progressButton.style.display="none"
    //setTimeout(function() {
      //register.parentElement.appendChild(h1)     
    //  setTimeout(function() {h1.style.opacity = 1}, 50)
    //}, eTime)
    
  }

  // when submitting the current question
  function validate() {

    // set the value of the field into the array
    questions[position].value = inputField.value

    // check if the pattern matches
    if (!inputField.value.match(questions[position].pattern || /.+/)) wrong()
    else ok(function() {

      
      // set the progress of the background
      progress.style.width = ++position * 100 / questions.length + 'vw'

      // if there is a new question, hide current and load next
      if (questions[position]) hideCurrent(putQuestion)
      else hideCurrent(done)
             
    })

  }

  function validate1(){
	if(check()){  
		if(position<questions.length){
		ok(function() {
      
      // set the progress of the background
      progress.style.width = ++position * 100 / questions.length + 'vw'

      // if there is a new question, hide current and load next
      if (questions[position]) hideCurrent(putQuestion)
      else hideCurrent(done)
             
    })
  }
  else{
	  
      done()
  }
	
	}else{wrong()}
  }

  // helper
  // --------------

  function hideCurrent(callback) {
    inputContainer.style.opacity = 0
    inputProgress.style.transition = 'none'
    inputProgress.style.width = 0
    setTimeout(callback, wTime)
  }

  function showCurrent(callback) {
    inputContainer.style.opacity = 1
    inputProgress.style.transition = ''
    inputProgress.style.width = '100%'
    setTimeout(callback, wTime)
  }

  function transform(x, y) {
    //register.style.transform = 'translate(' + x + 'px ,  ' + y + 'px)'
  }

  function ok(callback) {
    //register.className = ''
    setTimeout(transform, tTime * 0, 0, 10)
    setTimeout(transform, tTime * 1, 0, 0)
    setTimeout(callback,  tTime * 2)
  }

  function wrong() {
    //register.className = 'wrong'
    for(var i = 0; i < 6; i++) // shaking motion
      setTimeout(transform, tTime * i, (i%2*2-1)*20, 0)
    
  }

}())