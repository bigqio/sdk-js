# BigQ Javascript SDK

Javascript client library for accessing BigQ using a websocket.

## Installation
```
$ npm install --global bigqsdk
```

## Test Application
Refer to test.js for a simple application that will connect to a local BigQ server using TCP port 8002 (without SSL).  The BigQ server will need to be configured to start the websocket server using TCP port 8002.

## Simple Example
Include the SDK.
```
const BigQ = require("bigqsdk");
```

Define the callbacks.
```
function onConnect(data, err) { }
function onDisconnect(data, err) { }
function onMessage(data, err) { }
function onChannelMessage(data, err) { }
```

Initialize the SDK.
```
let bigq = new BigQ(
	"localhost", 		// BigQ server hostname
	8002, 				// TCP port
	false, 				// enable/disable SSL
	"default", 			// client email address
	"default", 			// client password
	"default", 			// client GUID
	false,				// enable/disable debug logging
	onConnect, 			// callback to use upon successful connection
	onDisconnect, 		// callback to use upon failed connection
	onMessage);			// callback to use upon message receipt
```

Send a private message to another client.
```
bigq.send(
	"clientGuid", 	// GUID of the recipient
	null, 			// channel GUID
	false, 			// enable if synchronous
	"hello!");		// data
```

List channels.
```
bigq.listChannels();
```

Join or leave channel.
```
bigq.joinChannel("channelGuid", onChannelMessage);
bigq.leaveChannel("channelGuid");
```

Subscribe or unsubscribe channel (only for multicast channels).
```
bigq.subscribeChannel("channelGuid", onChannelMessage);
bigq.unsubscribeChannel("channelGuid");
```

Send a message to a channel.
```
bigq.send(
	null,		 	// GUID of the recipient
	"channelGuid", 	// channel GUID
	false, 			// enable if synchronous
	"hello!");		// data
```
