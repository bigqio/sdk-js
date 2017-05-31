var ws = new WebSocket("ws://127.0.0.1:8002/");
ws.onmessage = function (event) {
  console.log(event.data);
};

var newLine = "\r\n";
var loginData = "";
loginData += "Email: default" + newLine;
loginData += "Password: default" + newLine;
loginData += "Command: Login" + newLine;
loginData += "SenderGUID: default" + newLine;
loginData += "ReceipientGUID: 00000000-0000-0000-0000-000000000000" + newLine;
loginData += "SyncRequest: true" + newLine;
loginData += "CreatedUtc: 05/01/2017 01:01:01.0000000" + newLine;
loginData += "SyncTimeoutMs: 5000" + newLine;
loginData += "MessageId: 0" + newLine;
loginData += newLine;

var loginMsg = loginData.length + ":" + loginData;

