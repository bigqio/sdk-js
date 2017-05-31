//
// Test.js
//
// Use this script to test the Javascript SDK for BigQ.
//
//
// dependencies:
//   prompt   "npm install prompt"
//

const BigQ = require("./bigq.js");
const prompt = require("prompt");

function processCommands() {
    var runForever = true;
    prompt.start();
    prompt.get(["command"], function (err, result) {
        if (err) {
            console.log("Error: " + err);
        }
        else {
            console.log("Received command: " + result.command);
            var command = result.command.toString().trim();
            if (command.startsWith("/")) {
                //<editor-fold desc="User Message">

                command = command.substring(1, command.length);
                var spacePos = result.command.indexOf(" ");
                if (spacePos <= 0) {
                    console.log("");
                    console.log("Usage: /name message");
                    console.log("       i.e.");
                    console.log("       /joel howdy!");
                }
                else {
                    var nick = command.substring(0, spacePos - 1);
                    var data = command.substring(spacePos, command.length);
                    console.log("");
                    console.log("Sending message to " + nick + ": " + data);

                    bigq.send(nick, null, false, data);
                }

                //</editor-fold>
            }
            else if (command.startsWith("#")) {
                //<editor-fold desc="Channel Message">

                command = command.substring(1, command.length);
                var spacePos = result.command.indexOf(" ");
                if (spacePos <= 0) {
                    console.log("");
                    console.log("Usage: #chan message");
                    console.log("       i.e.");
                    console.log("       /all howdy!");
                }
                else {
                    var channelGuid = command.substring(0, spacePos - 1);
                    var data = command.substring(spacePos, command.length);
                    console.log("");
                    console.log("Sending message to channel " + channelGuid + ": " + data);

                    bigq.send(null, channelGuid, false, data);
                }

                //</editor-fold>
            }
            else if (command.startsWith("join ")) {
                //<editor-fold desc="Join Channel">

                command = command.substring(1, command.length);
                var spacePos = result.command.indexOf(" ");
                if (spacePos <= 0) {
                    console.log("");
                    console.log("Usage: join channelguid");
                    console.log("       i.e.");
                    console.log("       join 0000");
                }
                else {
                    var channelGuid = command.substring(spacePos, command.length);
                    console.log("");
                    console.log("Joining channel " + channelGuid);

                    bigq.joinChannel(channelGuid);
                }

                //</editor-fold>
            }
            else if (command.startsWith("leave ")) {
                //<editor-fold desc="Leave Channel">

                command = command.substring(1, command.length);
                var spacePos = result.command.indexOf(" ");
                if (spacePos <= 0) {
                    console.log("");
                    console.log("Usage: leave channelguid");
                    console.log("       i.e.");
                    console.log("       leave 0000");
                }
                else {
                    var channelGuid = command.substring(spacePos, command.length);
                    console.log("");
                    console.log("Leaving channel " + channelGuid);

                    bigq.leaveChannel(channelGuid);
                }

                //</editor-fold>
            }
            else if (command.startsWith("subscribe ")) {
                // <editor-fold desc="Subscribe Channel">

                command = command.substring(1, command.length);
                var spacePos = result.command.indexOf(" ");
                if (spacePos <= 0) {
                    console.log("");
                    console.log("Usage: subscribe channelguid");
                    console.log("       i.e.");
                    console.log("       subscribe 0000");
                }
                else {
                    var channelGuid = command.substring(spacePos, command.length);
                    console.log("");
                    console.log("Subscribing channel " + channelGuid);

                    bigq.subscribeChannel(channelGuid);
                }

                // </editor-fold>
            }
            else if (command.startsWith("unsubscribe ")) {
                // <editor-fold desc="Unsubscribe channel">

                command = command.substring(1, command.length);
                var spacePos = result.command.indexOf(" ");
                if (spacePos <= 0) {
                    console.log("");
                    console.log("Usage: unsubscribe channelguid");
                    console.log("       i.e.");
                    console.log("       unsubscribe 0000");
                }
                else {
                    var channelGuid = command.substring(spacePos, command.length);
                    console.log("");
                    console.log("Unsubscribing channel " + channelGuid);

                    bigq.unsubscribeChannel(channelGuid);
                }

                // </editor-fold>
            }
            else {
                // <editor-fold desc="Other Commands">

                switch (result.command) {
                    case "?":
                        console.log("Available commands:");
                        console.log(" ?                       help, this menu");
                        console.log(" q                       quit");
                        console.log(" /<name> <msg>           send msg to name");
                        console.log(" join <changuid>         join the specified channel by GUID");
                        console.log(" leave <changuid>        leave the specified channel by GUID");
                        console.log(" subscribe <changuid>    subscribe to the specified channel by GUID");
                        console.log(" #<changuid> <msg>       send msg to channel by GUID");
                        console.log(" who                     show which clients are connected");
                        console.log(" state                   show BigQ connection state");
                        console.log(" reconnect               reconect to BigQ");
                        break;

                    case "q":
                        runForever = false;
                        break;

                    case "who":
                        bigq.listClients();
                        break;

                    case "state":
                        console.log("Connected: " + bigq.connected);
                        break;

                    case "reconnect":
                        bigq = new BigQ("localhost", 8002, false, "default", "default", "default", false, onConnect, onDisconnect, onMessage);
                        break;
                }

                //</editor-fold>
            }
        }

        if (runForever) processCommands();
    });
}

//<editor-fold desc="Callbacks">

function onConnect(data, err) {
    if (data) {
        console.log("Connected to BigQ");
    }
    else {
        console.log("Connection error: " + err);
    }
}

function onDisconnect(data, err) {
    if (data) {
        console.log("Disconnected from BigQ");
    }
    else {
        console.log("Connection error: " + err);
    }
}

function onMessage(data, err) {
    if (data) {
        console.log("Message received: " + data);
    }
    else {
        console.log("Message error: " + err);
    }
}

//</editor-fold>

//<editor-fold desc="Test">

// hostname, port, ssl, email, password, guid, debug, onConnect, onDisconnect, onMessage
let bigq = new BigQ("localhost", 8002, false, "default", "default", "default", false, onConnect, onDisconnect, onMessage);
processCommands();

//</editor-fold>

