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
//*
function __id(Id){
    return document.getElementById(Id);
}
//*/
