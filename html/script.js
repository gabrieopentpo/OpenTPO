//include functions
/* Event handling from Dean Edwards: http://dean.edwards.name/weblog/2005/10/add-event/*/

function addEvent(element, type, handler) {
  // assign each event handler a unique ID
  if (!handler.$$guid) handler.$$guid = addEvent.guid++;
  // create a hash table of event types for the element
  if (!element.events) element.events = {};
  // create a hash table of event handlers for each element/event pair
  var handlers = element.events[type];
  if (!handlers) {
    handlers = element.events[type] = {};
    // store the existing event handler (if there is one)
    if (element["on" + type]) {
      handlers[0] = element["on" + type];
    }
  }
  // store the event handler in the hash table
  handlers[handler.$$guid] = handler;
  // assign a global event handler to do all the work
  element["on" + type] = handleEvent;
};
// a counter used to create unique IDs
addEvent.guid = 1;

function removeEvent(element, type, handler) {
  // delete the event handler from the hash table
  if (element.events && element.events[type]) {
    delete element.events[type][handler.$$guid];
  }
};

function handleEvent(event) {
  // grab the event object (IE uses a global event object)
  event = event || window.event;
  // get a reference to the hash table of event handlers
  var handlers = this.events[event.type];
  // execute each event handler
  for (var i in handlers) {
    this.$$handleEvent = handlers[i];
    this.$$handleEvent(event);
  }
};





function __deleteNode(node){
    if (node != null){
	var parent = node.parentNode;
	node.parentNode.removeChild(node);
	return true;
    }
    else{
	return false;
    }
}
function __deleteId(Id){
    __deleteNode(document.getElementById(Id));
}
function __deleteAllChild(parent){
    if (parent == null) return false;
    var childNode;
    for (; (childNode = parent.lastChild) != null; ){
	parent.removeChild(childNode);
    }
}
function __show(Id){
    __deleteId('style' + Id);
    var sheet = document.createElement('style');
    sheet.innerHTML = '#' + Id + ' {display: block !important;}';
    sheet.id = 'style' + Id;
    document.body.appendChild(sheet);
}
function __hide(Id){
    __deleteId('style' + Id);
}
function __hideAll(){
    var arr;
    for (; (arr = document.getElementsByTagName('style')).length > 0;){
	__deleteNode(arr[0]);
    }
}
function __appendTextNode(parent, text){
    if (parent == null) return false;
    var textnode = document.createTextNode(text);
    parent.appendChild(textnode);
    return textnode;
}
function __appendNode(parent, tagname){
    if (parent == null) return false;
    var newnode = document.createElement(tagname);
    parent.appendChild(newnode);
    return newnode;
}
function __getNthChild(parent, n, tagname){
    if (parent == null) return false;
    var arr = parent.childNodes;
    var count = 0;
    for (var i = 0; i < arr.length; i++){
	if (arr[i].nodeName.toLowerCase() === tagname.toLowerCase()){
	    count++;
	}
	if (count === n){
	    return arr[i];
	}
    }
    return false;
}
function __addStyleSheet(Id, str){
    var sheet = document.createElement('style');
    sheet.innerHTML = str;
    sheet.id = Id;
    document.body.appendChild(sheet);
}
function __id(Id){
    return document.getElementById(Id);
}
//include functions end


//data structure definitions
var _reading = function(){
    var text = new Array();
    var seen = new Array();
    var last = new Array();
    var q = new Array();
    var maxseen;
    return {
	updateMaxSeen : function(thisq){
	    maxseen = (thisq > maxseen) ? thisq : maxseen;
	},
	getMaxSeen : function(){
	    return maxseen;
	},
	reset: function(){
	    text = [];
	    seen = [];
	    q = [];
	    maxseen = 0;
	},
	addText : function(str){
	    text[text.length] = str;
	    seen[seen.length] = false;
	    last[last.length] = q.length;
//process text AFTER processing questions, so flag[reading] = the last number of q
	},
	getText : function(num){
	    return text[num];
	},
	addQ : function(theq){
	    q[q.length] = theq;
	},
	getQ : function(num){
	    return q[num];
	},
	totalQ : function(){
	    return q.length;
	},
	correspondTextNum : function(qnum){
	    var i = 0;
	    while (qnum >= last[i]){
		i++;
	    }
	    return i;
	},
	hasSeen : function(pnum){
	    return seen[pnum];
	},
	setSeen : function(pnum){
	    seen[pnum] = true;
	},
	addMarkPara : function(qnum, para){
	    if (!q[qnum].markPara){
		q[qnum].markPara = [];
	    }
	    q[qnum].markPara.push(para);
	}
    };
}();

var generalTimer = function(){
    var timeremain = 0;
    var counting = false;
    var showing = false;
    var controller;
    function updateReadableTimer(thetime){
	var hourN = thetime / 3600;
	var minuteN = (thetime % 3600) / 60;
	var secondN = thetime % 60;
	__deleteAllChild(__id('hours'));
	__deleteAllChild(__id('minutes'));
	__deleteAllChild(__id('seconds'));
	__appendTextNode(__id('hours'), parseInt(hourN / 10).toString() + parseInt(hourN % 10).toString());
	__appendTextNode(__id('minutes'), parseInt(minuteN / 10).toString() + parseInt(minuteN % 10).toString());
	__appendTextNode(__id('seconds'), parseInt(secondN / 10).toString() + parseInt(secondN % 10).toString());
    }
    function countWorker(){
	if (timeremain <= 0) return;
	timeremain--;
	updateReadableTimer(timeremain);
	controller = setTimeout(countWorker, 1000);
    }
    return {
	init : function(thetime){
	    if (counting){
		this.stop();
	    }
	    if (showing){
		this.hide();
	    }
	    timeremain = thetime;
	    updateReadableTimer(timeremain);
	},
	show : function(){
	    __show('hideTimeButton');
	    __hide('showTimeButton');
	    __show('timer');
	    showing = true;
	},
	hide : function(){
	    __hide('hideTimeButton');
	    __show('showTimeButton');
	    __hide('timer');
	    showing = false;
	},
	start : function(){
	    if (counting) return;
	    counting = true;
	    __show('pauseTestButton');
	    __hide('resumeTestButton');
	    __id('pauseTestButton').onclick = function(){
		generalTimer.stop();
	    };
	    controller = setTimeout(countWorker, 1000);
	},
	stop : function(){
	    if (!counting) return;
	    counting = false;
	    __hide('pauseTestButton');
	    __show('resumeTestButton');
	    __id('resumeTestButton').onclick = function(){
		generalTimer.start();
	    };
	    clearTimeout(controller);
	},
	resumeAppear : function(){
	    if (showing){
		this.show();
	    }else{
		this.hide();
	    }
	    if (counting){
		__show('pauseTestButton');
	    }else{
		__hide('pauseTestButton');
	    }
	},
	discard : function(){
	    this.stop();
	    this.hide();
	}
    }
}();
//data structure definitions end



var testSet = 0;
var allSets = 26;
var tpoMode = 0; //test=0 practice=1 review=2
var nowSection = 0; //r=0 l=1 s=2 w=3
//init
for (var i = 1; i <= allSets; i++){
    var thisset = 'TPO ' + parseInt(i / 10) + i % 10;
    var node = __id('setSelectButtons');
    var newButton = document.createElement('a');
    newButton.className = 'whiteButtonsSetSelect';
    newButton.href = 'javascript:';
    newButton.onclick = Function('testSet = ' + i + '; prepareSet(' + i + ');');
    node.appendChild(newButton);
    __appendTextNode(newButton, thisset);
}
function prepareSet(i){
    readingPreprocess(_readingmaterial[i - 1]);
    __hideAll();
    showTestIntro();
}


function resetSystem(){
    __hideAll();
    __show('welcomePage');
    __id('backButton').onclick = function(){
	__hideAll();
	__show('welcomePage');
    }
}
//then bind permanent buttons

__id('testModeButton').onclick = function(){
    __hideAll();
    __show('setSelectPage');
    tpoMode = 0;
    __show('backButton');
};
__id('reviewModeButton').onclick = function(){
    __hideAll();
    __show('setSelectPage');
    tpoMode = 2;
    __show('backButton');
};
__id('settingsLink').onclick = function (){
    __hideAll();
    __show('settingsPage');
    __show('backButton');
};
__id('helpLink').onclick = function (){
    __hideAll();
    __show('helpPage');
    __show('backButton');
};
__id('aboutLink').onclick = function (){
    __hideAll();
    __show('aboutPage');
    __show('backButton');
};
__id('contributeLink').onclick = function (){
    __hideAll();
    __show('contributePage');
    __show('backButton');
};
__id('acknowledgeLink').onclick = function (){
    __hideAll();
    __show('acknowledgePage');
    __show('backButton');
};
__id('testExitButton').onclick = function (){
    alert('Test will exit! Your progress has been saved.');
    clearThisSection();
    resetSystem();
};

resetSystem();

function clearThisSection(){
    switch(nowSection){
    case 0:
	clearReadingSection();
	break;
    case 1:
	//clearListeningSection();
	break;
    case 2:
	//clearSpeakingSection();
	break;
    case 3:
	//clearWritingSection();
	break;
    default:
	break;
    }
}


if (localStorage.getItem('recorded') === null){
    resetLocalStorage();
}

function resetLocalStorage(){
    localStorage.setItem('recorded', '1');
    for (var i = 1; i < 40; i++){
	localStorage.setItem('r' + i, '0');
	for (var j = 1; j < 50; j++){
	    localStorage.setItem('r' + i + '|' + j, '0');
	}
    }
}

function showTestIntro(){//test intro only appears in Test Mode
    if (tpoMode === 2){
	showReviewChart();
	return;
    }
    __show('testIntro');
    __show('testExitButton');
    __show('continueButton');
    __id('continueButton').onclick = function(){
	__hideAll();
	readingHub('directions');
    };
}
/*
function showReviewChart(){
    __id('backButton').onclick = function(){
	resetSystem();
    }
    __show('backButton');
    __show('reviewChart');
    generateReviewReadingChart();
}

function generateReviewReadingChart(){

    function getMyAnswerReadable(Tquestion){
	var ans = localStorage.getItem('r' + testSet + '|' + Tquestion);
	var str = '';
	for (var i = 0; i < 10; i++){
	    if ((ans & (1 << i)) !== 0){
		str += (i + 1).toString();
	    }
	}
	return str;
    }
    function getCorrectAnswerReadable(reading, question){
	var temp = readingPassages[reading].questions[question].ansCorrect;
	if (temp.length){
	    var str = '';
	    for (var i = 0; i < temp.length; i++){
		str += temp[i].toString();
	    }
	    return str;
	}else{
	    return temp.toString();
	}
    }


    loadReadingPassages();
    var allQuestion = calcQTotalNumber();
    __deleteAllChild(__id('reviewChartReading'));
    var tableNode = __appendNode(__id('reviewChartReading'), 'table');
    var trNode = __appendNode(tableNode, 'tr');
    trNode.className = 'reviewTableHead';
    __appendTextNode(__appendNode(trNode, 'th'), '#');
    __appendTextNode(__appendNode(trNode, 'th'), 'My answer');
    __appendTextNode(__appendNode(trNode, 'th'), 'Correct answer');
    for (var i = 1; i <= allQuestion; i++){
	var temp = splitReadingQNum(i);
	var thisReading = temp[0];
	var thisQuestion = temp[1];
	trNode = __appendNode(tableNode, 'tr');
	__appendTextNode(__appendNode(trNode, 'td'), i.toString());
	var myans = getMyAnswerReadable(i);
	var coans = getCorrectAnswerReadable(thisReading, thisQuestion);
	__appendTextNode(__appendNode(trNode, 'td'), myans);
	__appendTextNode(__appendNode(trNode, 'td'), coans);
	if (myans === coans){
	    trNode.className = 'reviewTableCorrect';
	}
	else{
	    trNode.className = 'reviewTableIncorrect';
	}
    }
}
function splitReadingQNum(Tquestion){
    var reading = 1;
    var question = Tquestion;
    if (question > readingPassages[1].questions.length - 1){
	question -= readingPassages[1].questions.length - 1;
	reading++;
    }else{
	return [reading, question];
    }
    if (question > readingPassages[2].questions.length - 1){
	question -= readingPassages[2].questions.length - 1;
	reading++;
    }else{
	return [reading, question];
    }
    return [reading, question];
}
*/

function readingPreprocess(originalarray){
    function readingPassagePreprocess(original, start){
	var qstart = start - 1;
	var temp;
	function ___paragraph(){
	    //||
	    var block = temp.split('||');
	    temp = '<h1>' + block[0] + '</h1>';
	    for (var i = 1; i < block.length; i++){
		temp += '<p>' + block[i] + '</p>';
	    }
	}
	function ___mark(){
	    //##1  ##
	    var block = temp.split('##');
	    var markFlag = false;
	    temp = '';
	    for (var i = 0; i < block.length; i++){
		if (markFlag === true){
		    var num = parseInt(block[i]);
		    var len;
		    len = (num < 10) ? 1 : 2;
		    temp += '<span class="r' + (num + qstart).toString() + '"><span class="rMark">' + block[i].substring(len, block[i].length) + '</span></span>';
		}
		else{
		    temp += block[i];
		}
		markFlag = !markFlag;
	    }
	}
	function ___arrow(){
	    //>>2
	    var block = temp.split('>>');
	    var paraCount = 0;
	    temp = block[0];
	    paraCount += block[0].split('<p>').length - 1;
	    for (var i = 1; i < block.length; i++){
		var num = parseInt(block[i]);
		var len;
		len = (num < 10) ? 1 : 2;
		temp += '<span class="r' + (num + qstart).toString() + '"><span class="rArrow"></span></span>' + block[i].substring(len, block[i].length);
		_reading.addMarkPara(num + qstart, paraCount);
		paraCount += block[i].split('<p>').length - 1;
	    }
	}
	function ___insert(reading){
	    //^^3
	    var block = temp.split('^^');
	    temp = block[0];
	    for (var i = 1; i < block.length; i++){
		var num = parseInt(block[i]);
		var strIns = _reading.getQ(num + qstart).sentence + ' ';
		var len;
		len = (num < 10) ? 1 : 2;
		temp += '<span class="r' + (num + qstart).toString() + '"><a class="rIns" onclick="insClick(' + ((i - 1) % 4).toString() + ');"></a><strong>' + strIns + '</strong></span>' + block[i].substring(len, block[i].length);
	    }
	}
	function ___glossary(){
	    
	}
	temp = original;
	___paragraph();
	___mark();
	___arrow();
	___insert(i);
	___glossary();
	return temp;
    }
    function readingQuestionPreprocess(original){
	function ___mark(temp){
	    //##  ##
	    var result;
	    var block = temp.split('##');
	    var markFlag = false;
	    result = '';
	    for (var i = 0; i < block.length; i++){
		if (markFlag === true){
		    result += '<span class="rMark">' + block[i] + '</span>';
		}
		else{
		    result += block[i];
		}
		markFlag = !markFlag;
	    }
	    return result;
	}
	var everyq = original.split('---');
	for (var j = 0; j < everyq.length; j++){
	    var thisq = new Object();
	    var detailq = everyq[j].split('::');
	    thisq.type = parseInt(detailq[1]);
	    if (detailq[0] === 'all'){//summary question
		thisq.heading = detailq[2];
		thisq.choice = detailq[3].split('||');
		thisq.ansCorrect = parseInt(detailq[4]);
	    }
	    else{
		thisq.gotoPara = parseInt(detailq[0]);
		if (parseInt(detailq[1]) === 4){//insert
		    thisq.sentence = detailq[2];
		    thisq.ansCorrect = parseInt(detailq[3]);
		}
		else{//single or multiple
		    thisq.heading = ___mark(detailq[2]);
		    thisq.choice = detailq[3].split('||');
		    thisq.ansCorrect = parseInt(detailq[4]);
		}
	    }
	    //alert(j.toString() + thisq.heading);
	    _reading.addQ(thisq);
	}
    }
    _reading.reset();
    for (var i = 0; i < 3; i++){
	var splited = originalarray[i].split('____');
	var qtotal = _reading.totalQ();
	readingQuestionPreprocess(splited[1]);
	_reading.addText(readingPassagePreprocess(splited[0], qtotal));
    }
}

function readingHub(status){
    function updatePassage(num){
	var thePassage = __id('readingPassage');
	__deleteAllChild(thePassage);
	thePassage.innerHTML = _reading.getText(num);
    }
    function updateQuestion(qnum){
	__deleteId('insStyle'); //delete the tracks of InsertQuestion
	//and generate and show question number in the header
	__deleteAllChild(__id('questionNumber'));
	var qnStr = 'Question ' + (qnum + 1) + ' of ' + _reading.totalQ();
	__appendTextNode(__id('questionNumber'), qnStr);
	__show('questionNumber');
	//questionSeen used in Review page
	_reading.updateMaxSeen(qnum);
	var theQ = _reading.getQ(qnum);
	if (theQ.type >= 6){//summary question
	    //	__deleteAllChild(__id('readingQ'));
	    __id('viewTextButton').onclick = function(){
		__hide('readingQSumSix');
		__show('readingSplitWindow');
		__hide('viewTextButton');
		__show('viewQuestionButton');
	    };
	    __id('viewQuestionButton').onclick = function(){
		__show('readingQSumSix');
		__hide('readingSplitWindow');
		__show('viewTextButton');
		__hide('viewQuestionButton');
	    };
	    __hide('readingQ');
	    __hide('readingQIns');
	    __show('readingQSumSix');
	    __show('viewTextButton');
	    __addStyleSheet('summaryNoBar', '#readingStatusBar {display: none !important;} #readingPassage {top: 0 !important;}');
	    __hide('readingSplitWindow');
	    /*
	    if (sumMap[nowReading - 1] === 0){//not reached
		sumMap[nowReading - 1] = [-1, -1, -1];
	    }
	    __deleteAllChild(__id('readingQSumSixHead'));
	    __appendTextNode(__id('readingQSumSixHead'), theQ.heading);
	    __deleteAllChild(__id('readingQSumSixChoicesL'));
	    var listNode = __id('readingQSumSixChoicesL');
	    for (var i = 0; i < 3; i++){
		var tempNode;
		__appendTextNode(tempNode = __appendNode(__appendNode(listNode, 'li'), 'a'), theQ.choice[i]);
		tempNode.id = 'tempstyleSumSix' + i.toString();
		tempNode.href = 'javascript:';
		tempNode.onclick = Function('sumSixClick(' + i.toString() + ');');
	    }
	    __deleteAllChild(__id('readingQSumSixChoicesR'));
	    listNode = __id('readingQSumSixChoicesR');
	    for (var i = 3; i < 6; i++){
		var tempNode;
		__appendTextNode(tempNode = __appendNode(__appendNode(listNode, 'li'), 'a'), theQ.choice[i]);
		tempNode.id = 'tempstyleSumSix' + i.toString()
		tempNode.href = 'javascript:';
		tempNode.onclick = Function('sumSixClick(' + i.toString() + ');');
	    }
	    __show('readingQSumSix');
	    sumSixDisplayUpdate();*/
	}
	else if (theQ.type < 3){ //normal or multiple question
	    __hide('readingQIns');
	    __show('readingQ');
	    var qNode = __id('readingQ');
	    __deleteAllChild(qNode);
	    var qhStr = theQ.heading;
	    if (theQ.type === 2){//if it is a multiple question, we should give some instructions
		qhStr += ' <strong>Choose 2 correct answers.</strong>';
	    }
	    __appendNode(qNode, 'p').innerHTML = qhStr;
	    var choiceList = __appendNode(qNode, 'ul');
	    if (theQ.type === 1){
		var choiceClass = 'oval';
	    }
	    else{
		var choiceClass = 'square';
	    }
	    for (var i = 0; i <= 3; i++){
		var liNode = __appendNode(choiceList, 'li');
		var aNode = __appendNode(liNode, 'a');
		aNode.href = 'javascript:';
		liNode.onclick = Function(choiceClass + 'Click(' + i.toString() + ');');
		__appendTextNode(aNode, theQ.choice[i]);
		if ((readingReadAnswer[qnum] & (1 << i)) != 0){
		    liNode.className = choiceClass + 'Selected';
		}
		else{
		    liNode.className = choiceClass + 'NotSelected';
		}
		liNode.id = 'choice' + i.toString();
	    }
	    if (theQ.markPara){
		var arrowText = 'Paragraph ' + theQ.markPara[0] + ' ';
		if (theQ.markPara.length > 1){
		    for (var i = 1; i < theQ.markPara.length; i++){
			arrowText += 'and ' + theQ.markPara[i] + ' ';
		    }
		    arrowText += 'are marked with arrows';
		}
		else{
		    arrowText += 'is marked with an arrow';
		}
		arrowText += ' [<span class="rArrowQ"></span>].';
		var arrowNode = __appendNode(qNode, 'p');
		arrowNode.innerHTML = arrowText;
		arrowNode.style.position = 'relative';
		arrowNode.style.top = '2.6em';
	    }
	}
	else if (theQ.type === 4){
	    __hide('readingQ');
	    __show('readingQIns');
	    var theNode = __id('toBeInserted');
	    __deleteAllChild(theNode);
	    __appendTextNode(theNode, theQ.sentence);
	    for (var i = 0; i < 4; i++){
		if ((readingReadAnswer[qnum] & (1 << i)) != 0){
		    insClick(i);
		    break;
		}
	    }
	}
	var sheetName = 'r' + qnum;
	var strSS = '.' + sheetName;
	var newsheet = strSS + ' .rArrow, ' + strSS + ' a.rIns {display: inline-block;} ' + strSS + ' .rMark {background: #c0c0c0 !important;}';
	__addStyleSheet(sheetName, newsheet);
    }
    

    __hideAll();
    __show('testExitButton');
    __show('sectionExitButton');
    for (var i = 1; i <= _reading.totalQ(); i++){
	__deleteId('r' + i.toString());
    }
    if (status === 'directions'){
	__show('readingSectionDirections');
	__show('nextButtonGrey');
	__show('backButtonGrey');
	__show('helpButton');
	__show('reviewButtonGrey');
	__show('continueButton');
	__id('continueButton').onclick = function(){
	    generalTimer.init(3600);
	    generalTimer.start();
	    generalTimer.show();
	    readingHub(0);//question no.1 ready!
	};
	return;
    }
    generalTimer.resumeAppear();
    if (status === 'haveTime'){
	__hide('testExitButton');
	__hide('sectionExitButton');
	__show('continueButton');
	__show('reviewSquareButton');
	__show('returnButton');
	__show('readingHaveTime');
	__id('returnButton').onclick = function(){
	    readingHub(_reading.totalQ() - 1);
	};
	__id('continueButton').onclick = function(){
	    clearReadingSection();
	    resetSystem();
	};//temporarily halt the test, since listening section is not ready
	__id('reviewSquareButton').onclick = function(){
	    readingHub('review' + _reading.totalQ().toString());
	};
	return;
    }
    var reviewtest = /^review([0-9]+)$/;
    if (reviewtest.test(status)){
	__show('readingReview');
	__show('returnButton');
	__show('gotoQuestionButton');
	var presentq = parseInt(reviewtest.exec(status)[1]);
	var selectedq = presentq;
	var returnButtonClick;
	__id('returnButton').onclick = function(){
	    if (presentq < _reading.totalQ()){
		readingHub(presentq);
	    }else{
		readingHub('haveTime');
	    }
	};
	__id('gotoQuestionButton').onclick = function(){
	    readingHub(selectedq);
	};
	return;
    }
    if (typeof status === 'number'){
	__show('readingSplitWindow');
	questionNow = status;
	var readingNumber = _reading.correspondTextNum(status);
	thisSeen = _reading.hasSeen(readingNumber);
//alert(status.toString() + ' ' + readingNumber.toString());
	updatePassage(readingNumber);
	if (!thisSeen){
	    __deleteAllChild(__id('readingQ'));
	    __show('continueCircleButton');
	    __show('testExitButton');
	    __show('sectionExitButton');
	    __id('continueCircleButton').onclick = function(){
		_reading.setSeen(readingNumber);
		readingHub(status);
	    }
	    return;
	}
	__show('nextButton');
	if (status === 0){
	    __show('backButtonGrey');
	}else{
	    __show('backButton');
	}
	__show('helpButton');
	__show('reviewButton');
	__id('reviewButton').onclick = function(){
	    readingHub('review' + status.toString());
	};
	__id('backButton').onclick = function(){
	    readingHub(status - 1);
	};
	__id('nextButton').onclick = function(){
	    if (status + 1 === _reading.totalQ()){
		readingHub('haveTime');
	    }else{
		readingHub(status + 1);
	    }
	};
	updateQuestion(status);
    }
}

var answerManager = function(){
    return{
	read : function(mode, qnum){
	    return localStorage.getItem(testSet.toString() + mode + qnum.toString());
	},
	write : function(mode, qnum, ans){
	    localStorage.setItem(testSet.toString() + mode + qnum.toString(), ans);
	},
	touch : function(mode){
	    localStorage.setItem(testSet.toString() + mode, 1);
	},
	touched: function(mode){
	    if (localStorage.getItem(testSet.toString() + mode)){
		return true;
	    }else{
		return false;
	    }
	}
    }
}();
