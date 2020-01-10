var questions = [];
var submission=[];
var sub_branch=[];
var index_po=0;
var subb;
var xhr = new XMLHttpRequest();
xhr.overrideMimeType("application/json");
xhr.onreadystatechange = function() {
   if (xhr.readyState == XMLHttpRequest.DONE) {
	index_po=JSON.parse(xhr.responseText).idd;
	subb="sub"+index_po;
	eval("id"+index_po).style.background="dimgrey";
	console.log(xhr.responseText)
   }
}
xhr.open('GET', 'feedbackForm/idd', false);
xhr.send(null);

if(document.getElementById("id"+index_po).className=='S'){
	var dict=[];
	for(var joo in questions_all[0])
		dict.push({'question': questions_all[0][joo]})
	questions=dict
}
else{
	var dict=[];
	for(var joo in questions_all[1])
		dict.push({'question': questions_all[1][joo]})
	questions=dict
}

xhr.onreadystatechange = function() {
   if (xhr.readyState == XMLHttpRequest.DONE) {
   sub_branch=JSON.parse(xhr.responseText).sub;
   if(sub_branch[index_po]!=undefined){
	submission=sub_branch[index_po];
	if(submission[0]!=undefined)
		document.getElementById('star-'+submission[0]+'-2').checked=true;
	}
	sub_branch.forEach(function m20(item, index)
	{
		if(item)
		{
			if(document.getElementById("id"+index).className=='S'){
				if(item.length==questions_all[0].length)
					eval("sub"+index).style.opacity=1;
			}
			else{
				if(item.length==questions_all[1].length)
					eval("sub"+index).style.opacity=1;
			}
			
		}
	});
   }
}
xhr.open('GET', 'feedbackForm/sub', false);
xhr.send(null);

function submit_f(){
	var ques_no_S = document.getElementsByClassName('S').length;
	var ques_no_L = document.getElementsByClassName('L').length;
	var sum_All= (questions_all[0].length*ques_no_S) + (questions_all[1].length*ques_no_L);
	//var ques_no = document.getElementById("ques_no").childElementCount - 4;
	var sum=0;
	for(var i in sub_branch)
		if(sub_branch[i])
			sum+=sub_branch[i].length;
	
	if(sum_All == sum)
		document.getElementById("subnn").innerHTML="<button type='button' arial-expanded='false' class='button' onclick='submissions()' >SUBMIT</button>";
}

/**
xhr.send(null);
if(submission.length>=1){
	console.log('star-'+submission[0]+'-2');
	document.getElementById('star-'+submission[0]+'-2').checked=true;
}**/

function submissions(){
	var names;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "feedbackForm/request_all", false);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onreadystatechange = function() {
      if(this.responseText){
		console.log(this.responseText)
		names=this.responseText;
		}
	};
	xhr.send(null);
	var pol;
	var sub=[];
	var lab=[];
	for(var i in sub_type){
		if(sub_type[i]=='S')
		{
			var temp=sub_branch[i];
			temp.unshift(names+sub_name[i]+sub_type[i]);
			sub.push(temp);
		}
		else
		{
			var temp=sub_branch[i];
			temp.unshift(names+sub_name[i]+sub_type[i]);
			lab.push(temp);
		}
	}
	pol={'S':sub,'L':lab}
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "feedbackForm/final_all", false);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({'op':pol}));
	console.log(pol);
	alert("Thanks For your Submission, Get back to class Now!!")
	window.location='/index.html';	
}


function got(i){
	var xhr = new XMLHttpRequest();
		xhr.open("POST", "feedbackForm/"+i, false);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(null);
	window.location='/feedbackForm';
}


;(function(){

	
  var tTime = 100  // transition transform time from #register in ms
  var wTime = 200  // transition width time from #register in ms
  var eTime = 1000 // transition width time from inputLabel in ms

  // init
  // --------------
  var position = 0
  

  putQuestion()
  submit_f();
  progressButton.addEventListener('click', validate1)
  
  /*inputField.addEventListener('keyup', function(e){
    transform(0, 0) // ie hack to redraw
    if(e.keyCode == 13) validate()
  })
  */
  // functions
  // --------------

  function check(){
	  if(document.getElementById('star-1-2').checked){
		  submission[position]=1;
		  sub_branch[index_po]=submission;
		document.getElementById('star-1-2').checked=false;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "feedbackForm", true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({
		sub: sub_branch
		}));
	  }
	  else if(document.getElementById('star-2-2').checked){
		  submission[position]=2;
		  sub_branch[index_po]=submission;
		document.getElementById('star-2-2').checked=false;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "feedbackForm", true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({
		sub: sub_branch
		}));
	  }
	  else if(document.getElementById('star-3-2').checked){
		  submission[position]=3;
		  sub_branch[index_po]=submission;
		document.getElementById('star-3-2').checked=false;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "feedbackForm", true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({
		sub: sub_branch
		}));
	  }
	  else if(document.getElementById('star-4-2').checked){
		  submission[position]=4;
		  sub_branch[index_po]=submission;
		document.getElementById('star-4-2').checked=false;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "feedbackForm", true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({
		sub: sub_branch
		}));
	  }
	  else if(document.getElementById('star-5-2').checked){
		  submission[position]=5;
		  sub_branch[index_po]=submission;
		document.getElementById('star-5-2').checked=false;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "feedbackForm", true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({
		sub: sub_branch
		}));
	  }
	  else{
		  console.log(submission,position);
		  return false;}
	  console.log(submission,position);
	  return true;
	  
  }
  // load the next question
  function putQuestion() {
    inputLabel.innerHTML = questions[position].question;
	//if(submission[position]!=undefined){
	//	document.getElementById('star-'+submission[0]+'-2').checked=true;
	//}
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
    eval(subb).style.opacity=1
	inputLabel.innerHTML='Thanks for your Submission..'
	document.getElementById('stars1').innerHTML="";
	submit_f()
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
      progress.style.width = ++position * 100 / questions.length + '%'

      // if there is a new question, hide current and load next
      if (questions[position]){
		  if(submission[position]!=undefined){
			document.getElementById('star-'+submission[position]+'-2').checked=true;
			}
		  hideCurrent(putQuestion)
		  }
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