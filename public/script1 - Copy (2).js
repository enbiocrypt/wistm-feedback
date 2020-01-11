var questions = [];
var submission=[];
var sub_branch=[];
var index_po=0;
var subb;
var xhr = new XMLHttpRequest();
var start=0;
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
	//if(submission[0]!=undefined)
	//	document.getElementById('star-'+submission[0]+'-2').checked=true;
	}
	sub_branch.forEach(function m20(item, index)
	{
		console.log(item,index);
		if(item)
		{
			if(document.getElementById("id"+index).className=='S'){
				var temp=0;
				for(var key in questions_all[0])
					temp+=questions_all[0][key].length
				if(item.length==temp)
					eval("sub"+index).style.opacity=1;
			}
			else{
				var temp=0;
				for(var key in questions_all[1])
					temp+=questions_all[1][key].length
				if(item.length==temp)
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
	var temp1=0,temp2=0;
	for(var key in questions_all[0])
		temp1+=questions_all[0][key].length
	for(var key in questions_all[1])
		temp2+=questions_all[1][key].length
	var sum_All= (temp1*ques_no_S) + (temp2*ques_no_L);
	//var ques_no = document.getElementById("ques_no").childElementCount - 4;
	var sum=0;
	for(var i in sub_branch)
		if(sub_branch[i])
			sum+=sub_branch[i].length;
	
	if(sum_All == sum){
	document.getElementsByClassName("poplice")[0].innerHTML=`<br><div id="inputContainer" class="col-12 ip1">
      <label id="inputLabel">Thanks For Your Submission....</label></div>`
	document.getElementById("subnn").innerHTML="<button type='button' arial-expanded='false' class='button' onclick='submissions()' >SUBMIT</button>";
	}
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
	  console.log(position)
	  for(var i=0;i<questions[position].question.length;i++)
	  if(document.getElementById('star-1-2-'+(start+i)).checked){
		  submission[start+i]=1;
		  sub_branch[index_po]=submission;
		document.getElementById('star-1-2-'+(start+i)).checked=false;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "feedbackForm", true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({
		sub: sub_branch
		}));
	  }
	  else if(document.getElementById('star-2-2'+'-'+(start+i)).checked){
		  submission[start+i]=2;
		  sub_branch[index_po]=submission;
		document.getElementById('star-2-2'+'-'+(start+i)).checked=false;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "feedbackForm", true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({
		sub: sub_branch
		}));
	  }
	  else if(document.getElementById('star-3-2'+'-'+(start+i)).checked){
		  submission[start+i]=3;
		  sub_branch[index_po]=submission;
		document.getElementById('star-3-2'+'-'+(start+i)).checked=false;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "feedbackForm", true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({
		sub: sub_branch
		}));
	  }
	  else if(document.getElementById('star-4-2'+'-'+(start+i)).checked){
		  submission[start+i]=4;
		  sub_branch[index_po]=submission;
		document.getElementById('star-4-2'+'-'+(start+i)).checked=false;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "feedbackForm", true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({
		sub: sub_branch
		}));
	  }
	  else if(document.getElementById('star-5-2'+'-'+(start+i)).checked){
		  submission[start+i]=5;
		  sub_branch[index_po]=submission;
		document.getElementById('star-5-2'+'-'+(start+i)).checked=false;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "feedbackForm", true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({
		sub: sub_branch
		}));
	  }
	  else{
		  console.log(submission,position);
		  return false;
		  }
	  console.log(submission,position);
	  return true;
	  
  }
  // load the next question
  function putQuestion() {
	  var temp=''
	  for(var i=0;i<questions[position].question.length;i++)
		temp+=`<br><div id="inputContainer" class="col-12 ip1">
      <label id="inputLabel">${questions[position].question[i]}</label>
      <div id="inputProgress"></div>
      <div class="cont col-12">
        <div class="stars" id="stars1">
          <form action=''>
            <input class='star star-5' id='star-5-2-${start+i}' type='radio' name='star'/>
            <label class='star star-5' for='star-5-2-${start+i}'></label>
            <input class='star star-4' id='star-4-2-${start+i}' type='radio' name="star"/>
            <label class='star star-4' for='star-4-2-${start+i}'></label>
            <input class='star star-3' id='star-3-2-${start+i}' type='radio' name='star'/>
            <label class='star star-3' for='star-3-2-${start+i}'></label>
            <input class='star star-2' id='star-2-2-${start+i}' type='radio' name='star'/>
            <label class='star star-2' for='star-2-2-${start+i}'></label>
            <input class='star star-1' id='star-1-2-${start+i}' type='radio' name='star'/>
            <label class='star star-1' for='star-1-2-${start+i}'></label>
          </form>
        </div>
      </div>
    </div>`
		/**temp+=`<br><div class="col-12 text-center">
				<i id="progressButton" class="ion-android-arrow-forward next"></i>
				</div>
				<div class="col-12" style="padding:50;text-align:center" id="subnn">
				</div>`**/
		  
	  //inputLabel.innerHTML = questions[position].question;
	
	document.getElementsByClassName("poplice")[0].innerHTML = temp;
	progress.style.height=document.getElementById("doleo").offsetHeight
	for(var i=0;i<questions[position].question.length;i++)
		if(submission[start+i]!=undefined){
			document.getElementById('star-'+submission[start+i]+'-2-'+(start+i)).checked=true;
		}
	  console.log(position)
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
    //inputContainer.style.opacity = 1
    eval(subb).style.opacity=1
	document.getElementsByClassName("poplice")[0].innerHTML=`<br><div id="inputContainer" class="col-12 ip1">
      <label id="inputLabel">Please Select Next Subject....</label></div>`
	  progress.style.height=document.getElementById("doleo").offsetHeight
	//document.getElementById('stars1').innerHTML="";
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
	  console.log(position);
	if(check()){  
		if(position<questions.length){
		ok(function() {
      
      // set the progress of the background
	  start+=questions[position].question.length
      progress.style.width = ++position * 100 / questions.length + '%'

      // if there is a new question, hide current and load next
      if (questions[position]){
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
    //inputContainer.style.opacity = 0
    //inputProgress.style.transition = 'none'
    //inputProgress.style.width = 0
    setTimeout(callback, wTime)
  }

  function showCurrent(callback) {
    //inputContainer.style.opacity = 1
    //inputProgress.style.transition = ''
    //inputProgress.style.width = '100%'
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