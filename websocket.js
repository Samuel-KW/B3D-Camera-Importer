function init() {
	document.ws_form.url.value = "ws://192.168.0.111:8080/";
	document.ws_form.inputtext.value = "0,0,0 0,0,0";
	document.ws_form.disconnectButton.disabled = true;
}

function doConnect() {
	try {
		websocket = new WebSocket(document.ws_form.url.value);
		websocket.onopen = function (evt) { onOpen(evt) };
		websocket.onclose = function (evt) { onClose(evt) };
		websocket.onmessage = function (evt) { onMessage(evt) };
		websocket.onerror = function (evt) { onError(evt) };
	} catch(e) { writeToScreen(e); }
}

function onOpen(evt) {
	writeToScreen("connected\n");
	document.ws_form.connectButton.disabled = true;
	document.ws_form.disconnectButton.disabled = false;
}

function onClose(evt) {
	writeToScreen("disconnected\n");
	document.ws_form.connectButton.disabled = false;
	document.ws_form.disconnectButton.disabled = true;
}

function onMessage(evt) {
	writeToScreen("response: " + evt.data + '\n');
}

function onError(evt) {
	writeToScreen('error: ' + evt.data + '\n');

	websocket.close();

	document.ws_form.connectButton.disabled = false;
	document.ws_form.disconnectButton.disabled = true;

}

function doSend(message) {
	writeToScreen("sent: " + message + '\n');
	websocket.send(message);
}

function writeToScreen(message) {
	document.ws_form.outputtext.value += message
	document.ws_form.outputtext.scrollTop = document.ws_form.outputtext.scrollHeight;

}

window.addEventListener("load", init, false);


function sendText() {
	doSend(document.ws_form.inputtext.value);
}

function clearText() {
	document.ws_form.outputtext.value = "";
}

function doDisconnect() {
	websocket.close();
}