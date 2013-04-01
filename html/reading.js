

var sumMap = [0, 0, 0];
var questionNow = 0;



/*
function showReadingSectionDirections(){
    __show('readingSectionDirections');
    __show('testExitButton');
    __show('sectionExitButton');
    __show('nextButtonGrey');
    __show('backButtonGrey');
    __show('helpButton');
    __show('reviewButtonGrey');
    __show('continueButton');
    __id('continueButton').onclick = function(){
	__hideAll();
	loadReadingPassages();
	nowReading = 1;
	nowQuestionSet(0);
	startTimer(3600);
	__show('timer');
	__show('continueCircleButton');
	__show('pauseTestButton');
	timerShow = true;
	__show('sectionExitButton');
	__show('testExitButton');
	__show('readingSplitWindow');
	readingPassagePreprocess();
	readingQuestionPreprocess();
	qTotalNumber = calcQTotalNumber();
	for (var i = 1; i <= qTotalNumber; i++){
	    readingAnswers[i] = parseInt(localStorage.getItem('r' + testSet.toString() + '|' + i.toString()));
	}
	readingUpdatePassage();
    };
    __id('pauseTestButton').onclick = pauseTestHandle;
    __id('resumeTestButton').onclick = resumeTestHandle;
    __id('hideTimeButton').onclick = hideTimer;
    __id('showTimeButton').onclick = showTimer;
    __id('continueCircleButton').onclick = function(){
	readingSeen[nowReading] = true;
	nowQuestionSet(1);
	__hide('continueCircleButton');
	__show('nextButton');
	if (nowReading === 1){
	    __show('backButtonGrey');
	}
	else{
	    __show('backButton');
	}
	__show('helpButton');
	__show('reviewButton');
	readingUpdateQuestion();
    };

    __id('backButton').onclick = function(){
	if (nowReading === 1 && nowQuestion === 2){
	    nowQuestionSet(1);
	    __hide('backButton');
	    __show('backButtonGrey');
	    readingUpdateQuestion();
	}
	else if (nowQuestion === 1){
	    if (nowReading === 1) return;
	    nowReading--;
	    nowQuestionSet(readingPassages[nowReading].questions.length - 1);
	    readingUpdatePassage();
	    readingUpdateQuestion();
	}
	else if (nowQuestion === readingPassages[nowReading].questions.length - 1){
	    nowQuestionSet(nowQuestion - 1);
	    __hide('viewTextButton');
	    __hide('viewQuestionButton');
	    __hide('readingQSumSix');
	    __show('readingSplitWindow');
	    __deleteId('summaryNoBar');
	    readingUpdateQuestion();
	}
	else{
	    nowQuestionSet(nowQuestion - 1);
	    readingUpdateQuestion();
	}
    };

    __id('nextButton').onclick = function(){
	if (nowQuestion === readingPassages[nowReading].questions.length - 1 && nowReading < 3){
	    __hide('viewTextButton');
	    __hide('viewQuestionButton');
	    __hide('readingQSumSix');
	    __show('readingSplitWindow');
	    __deleteId('summaryNoBar');
	    nowReading++;
	    if (readingSeen[nowReading]){
		nowQuestionSet(1);
		readingUpdatePassage();
		readingUpdateQuestion();
	    }
	    else{
		nowQuestionSet(0);
		__hide('nextButton');
		__hide('backButton');
		__hide('helpButton');
		__hide('reviewButton');
		__show('continueCircleButton');
		readingUpdatePassage();
		readingUpdateQuestion();//this function will be a little special to nowQuestion === 0
	    }
	}
	else if (nowReading === 1 && nowQuestion === 1){
	    __hide('backButtonGrey');
	    __show('backButton');
	    nowQuestionSet(nowQuestion + 1);
	    readingUpdateQuestion();
	}
	else if (nowReading === 3 && nowQuestion === readingPassages[nowReading].questions.length - 1){
	    __hideAll();
	    handleTimerAfterHideAll();
	    __show('continueButton');
	    __show('reviewSquareButton');
	    __show('returnButton');
	    __show('sectionExitButton');
	    __show('testExitButton');
	    __show('readingHaveTime');
	    __id('returnButton').onclick = function(){
		__hideAll();
		handleTimerAfterHideAll();
		nowReading = 3;
		nowQuestionSet(readingPassages[nowReading].questions.length - 1);
		__show('nextButton');
		__show('backButton');
		__show('helpButton');
		__show('reviewButton');
		__show('sectionExitButton');
		__show('testExitButton');
		readingUpdatePassage();
		readingUpdateQuestion();
	    };
	    __id('continueButton').onclick = function(){
		clearReadingSection();
		resetSystem();
	    };
	}
	else{
	    nowQuestionSet(nowQuestion + 1);
	    readingUpdateQuestion();
	}
    };
    __id('reviewSquareButton').onclick = __id('reviewButton').onclick = function(){

    };
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
}
*/
/*
function calcQNowNumber(){
    qNowNumber = 0;
    for (var i = 1; i < nowReading; i++){
	qNowNumber += readingPassages[i].questions.length - 1;
    }
    qNowNumber += nowQuestion;
}
function calcQTotalNumber(){
    var sum = 0;
    for (var i = 1; i < 4; i++){
	sum += readingPassages[i].questions.length - 1;
    }
    return sum;
}
function nowQuestionSet(target){
    __deleteId('r' + nowQuestion);
    nowQuestion = target;
}
*/

function ovalClick(index){
    if (__id('choice' + index.toString()).className === 'ovalNotSelected'){ //choose it
	for (var i = 0; i < 4; i++){
	    __id('choice' + i.toString()).className = 'ovalNotSelected';
	}
	__id('choice' + index.toString()).className = 'ovalSelected';
	readingUpdateAnswer(questionNow, index, 'rewrite');
    }
    else{//cancel it
	__id('choice' + index.toString()).className = 'ovalNotSelected';
	readingUpdateAnswer(questionNow, index, 'cancel');
    }
}
function squareClick(index){
    if (__id('choice' + index.toString()).className === 'squareNotSelected'){ //choose it
	__id('choice' + index.toString()).className = 'squareSelected';
	readingUpdateAnswer(questionNow, index, 'append');
    }
    else{//cancel it
	__id('choice' + index.toString()).className = 'squareNotSelected';
	readingUpdateAnswer(questionNow, index, 'cancel');
    }
}
function insClick(tindex){//0~~3
    __deleteId('insStyle');
    var strSS = '.r' + questionNow;
    var newStyle = strSS + ':nth-of-type(' + (tindex + 1).toString() + ') a.rIns {display: none !important;}' + strSS + ':nth-of-type(' + (tindex + 1).toString() + ') a.rIns + strong {display: inline !important;}';
    __addStyleSheet('insStyle', newStyle);
    readingUpdateAnswer(questionNow, tindex, 'rewrite');
}
function sumSixClick(index){
    var minimum = 10;
    var selected = 0;
    var isSelected = [false, false, false, false, false, false];
    for (var i = 0; i < 3; i++){
	if (sumMap[nowReading - 1][i] !== -1){
	    selected++;
	    isSelected[sumMap[nowReading - 1][i]] = true;
	}
	else{
	    minimum = (i < minimum) ? i : minimum;
	}
    }
    if (!isSelected[index]){
	if (selected >= 3) return;
	readingUpdateAnswer(qNowNumber, index, 'append');
	sumMap[nowReading - 1][minimum] = index;
	sumSixDisplayUpdate();
    }
}
function sumSixUnclick(pos){
    var num;
    if ((num = sumMap[nowReading - 1][pos]) === -1) return;
    readingUpdateAnswer(qNowNumber, num, 'cancel');
    sumMap[nowReading - 1][pos] = -1;
    sumSixDisplayUpdate();
}
function sumSixDisplayUpdate(){
    sumSixDisplayClear();
    //alert(sumMap[nowReading - 1][0] + ' ' + sumMap[nowReading - 1][1] + ' ' +sumMap[nowReading - 1][2]);
    var isSelected = [false, false, false, false, false, false];
    var aArr = __id('readingQSumSixAns').getElementsByTagName('a');
    for (var i = 0; i < 3; i++){
	if (sumMap[nowReading - 1][i] !== -1){
	    isSelected[sumMap[nowReading - 1][i]] = true;
	    aArr[i].innerHTML = readingPassages[nowReading].questions[nowQuestion].choice[sumMap[nowReading - 1][i]];
	}
	else{
	    aArr[i].innerHTML = ''; //a little cautious
	}
    }
    var styleStr = '';
    for (var i = 0; i < 3; i++){
	if (isSelected[i]){//hide it
	    styleStr += '#readingQSumSixChoicesL li:nth-of-type(' + (i + 1).toString() + ') a {display: none !important;}';
	}
    }
    for (var i = 3; i < 6; i++){
	if (isSelected[i]){//hide it
	    styleStr += '#readingQSumSixChoicesR li:nth-of-type(' + (i - 2).toString() + ') a {display: none !important;}';
	}
    }
    __addStyleSheet('sumSixStyle', styleStr);
}
function sumSixDisplayClear(){
    __deleteId('sumSixStyle');
    var aArr = __id('readingQSumSixAns').getElementsByTagName('a');
    for (i = 0; i < 3; i++){
	aArr[i].innerHTML = '';
    }
}
function readingUpdateAnswer(question, choice, mode){
    var tempans = localStorage.getItem('r' + testSet + '|' + question);
    if (mode === 'rewrite'){//single choice
	tempans = 1 << choice;
	//alert(1 << choice);
    }
    else if (mode === 'cancel'){
	tempans -= 1 << choice;
    }
    else if (mode === 'append'){
	tempans += 1 << choice;
    }
    if (tempans < 0) tempans = 0; // preventing measure
    localStorage.setItem('r' + testSet + '|' + question, tempans.toString());
    localStorage.setItem('r' + testSet, '1');
}
function readingReadAnswer(question){
    return localStorage.getItem('r' + testSet + '|' + question);
}
function exitReadingSection(){
    clearReadingSection();
    switch(tpoMode){
    case 0:
	startListening();
	break;
    case 1:
	__show('setSelectPage');
	__id('backButton').onclick = function(){
	    __hideAll();
	    __show('welcomePage');
	};
	break;
    case 2:
	break;
	default:
	break;
    };
}

function clearReadingSection(){
    __hideAll();
    generalTimer.discard();
}

