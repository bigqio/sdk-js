//
// BigQ Javascript SDK
//
// All callback handlers should be of the form function(data, err) { }
//
// Dependencies:
//   watsonwebsocket       "npm install watsonwebsocket"       https://www.npmjs.com/package/watsonwebsocket
//   bigqmessage           "npm install bigqmessage"           https://www.npmjs.com/package/bigqmessage
//

"use strict";

var Watson = require("watsonwebsocket");
var BigQMessage = require("./bigqmessage.js");

class BigQ {

    //<editor-fold desc="Internal General Methods">

    _log(msg) {
        if (this.debug) console.log(msg);
    }

    _echo(msg) {
        return msg;
    }

    _randomGuid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
            s4() + "-" + s4() + s4() + s4();
    }

    _timestamp() {
        var date = new Date();
        var ret =
            ("00" + (date.getUTCMonth()+1)).slice(-2) + "/" +
            ("00" + date.getUTCDate()).slice(-2) + "/" +
            date.getUTCFullYear() + " " +
            ("00" + date.getUTCHours()).slice(-2) + ":" +
            ("00" + date.getUTCMinutes()).slice(-2) + ":" +
            ("00" + date.getUTCSeconds()).slice(-2);
        return ret;
    }

    //</editor-fold>

    //<editor-fold desc="Internal Message Processing Methods">

    _login() {
        var loginMsg = new BigQMessage(
            this.email,
            this.password,
            "Login",
            this.guid,
            this.serverGuid,
            null,
            true,
            null,
            null);

        this._watsonSend(loginMsg.toString());
        return;
    }

    _msgProcessor(data) {
        if (!data) {
            return;
        }
        else {
            // remove watson framing
            var colonPos = data.indexOf(":") + 1;
            if (colonPos > 0) data = data.toString().substr(colonPos);

            var msg = new BigQMessage(null, null, null, null, null, null, null, null, null);
            msg.fromString(data);

            if (!msg.command) {
                // <editor-fold desc="No command">

                if (msg.channelGuid) {
                    this._onChannelMessage(msg);
                }
                else {
                    if (this.onMessage) {
                        setTimeout(() => this.onMessage(msg, null));
                    }
                    else {
                        this._log("bigq no message callback defined");
                    }
                }

                // </editor-fold>
            }
            else {
                // <editor-fold desc="Command present">

                switch (msg.command.toLowerCase()) {
                    case "heartbeatrequest":
                        // do nothing
                        break;

                    case "login":
                        this._onLoginResponse(msg);
                        break;

                    default:
                        if (this.onMessage) {
                            setTimeout(() => this.onMessage(msg, null));
                        }
                        else {
                            this._log("bigq no message callback defined");
                        }
                        break;
                }

                // </editor-fold>
            }

            return;
        }
    }

    _onLoginResponse(msg) {
        if (msg.success) {
            this.loggedIn = true;
            this._log("bigq login successful");
            if (this.onConnect) setTimeout(() => this.onConnect("Connected", null));
        }
        else {
            this._log("bigq login failed");
            if (this.onConnect) setTimeout(() => this.onConnect(null, "Login failed"));
        }
    }

    _onChannelMessage(msg) {
        if (this.channelCallbacks) {
            if (this.channelCallbacks.hasOwnProperty(msg.channelGuid)) {
                setTimeout(() => this.channelCallbacks[msg.channelGuid](msg, null));
            }
        }
        else {
            if (this.onMessage) {
                setTimeout(() => this.onMessage(msg, null));
            }
            else {
                this._log("bigq no message callback defined");
            }
        }
    }

    _removeChannelCallback(guid) {
        if (this.channelCallbacks) {
            if (this.channelCallbacks.hasOwnProperty(guid)) {
                delete this.channelCallbacks[guid];
            }
        }
    }

    //</editor-fold>

    //<editor-fold desc="Watson Callbacks and Methods">

    _onOpen(evt) {
        this._log("bigq connected to " + this.hostname + ":" + this.port);
        setTimeout(() => this._login(), 1000);
        this.connected = true;
        // do not set loggedIn, set it no login response
        // do not fire callback here, call it on login response
    }

    _onClose(evt) {
        this._log("bigq websocket closed for " + this.hostname+ ":" + this.port);
        this.connected = false;
        this.loggedIn = false;
        if (this.onDisconnect) setTimeout(() => ths.onDisconnect(null, "Disconnected"));
    }

    _onMessage(evt) {
        this._msgProcessor(evt);
    }

    _onError(evt) {
        this._log("bigq error: " + evt);
    }

    _watsonSend(msg) {
        if (!msg) return;
        // this._log("bigq sending message: " + msg);
        this._watson.send(msg);
    }

    //</editor-fold>

    //<editor-fold desc="Public Methods">

    callbackTest(data, callback) {
        setTimeout(() => callback(data, null));
    }

    send(recipient, channel, sync, data) {
        var msg;
        if (recipient) {
            msg = new BigQMessage(
                this.email,
                this.password,
                null,
                this.guid,
                recipient,
                null,
                sync,
                null,
                data);
        }
        else if (channel) {
            msg = new BigQMessage(
                this.email,
                this.password,
                null,
                this.guid,
                null,
                channel,
                sync,
                null,
                data);
        }
        else {
            this._log("bigq either recipient or channel must be specified");
            return;
        }

        this._watsonSend(msg.toString());
        return;
    }

    listClients() {
        var msg = new BigQMessage(
            this.email,
            this.password,
            "ListClients",
            this.guid,
            this.serverGuid,
            null,
            true,
            null,
            null);

        this._watsonSend(msg.toString());
        return;
    }

    listChannels() {
        var msg = new BigQMessage(
            this.email,
            this.password,
            "ListChannels",
            this.guid,
            this.serverGuid,
            null,
            true,
            null,
            null);

        this._watsonSend(msg.toString());
        return;
    }

    joinChannel(guid, callback) {
        if (!guid) return;
        var msg = new BigQMessage(
            this.email,
            this.password,
            "JoinChannel",
            this.guid,
            this.serverGuid,
            guid,
            null,
            true,
            null,
            null
        );

        this._watsonSend(msg.toString());

        if (callback) {
            if (this.channelCallbacks) {
                if (this.channelCallbacks.hasOwnProperty(guid)) {
                    delete this.channelCallbacks[guid];
                }

                this.channelCallbacks[guid] = callback;
            }
        }

        return;
    }

    leaveChannel(guid) {
        if (!guid) return;
        var msg = new BigQMessage(
            this.email,
            this.password,
            "LeaveChannel",
            this.guid,
            this.serverGuid,
            guid,
            null,
            true,
            null,
            null
        );

        this._watsonSend(msg.toString());
        this._removeChannelCallback(guid);
        return;
    }

    subscribeChannel(guid) {
        if (!guid) return;
        var msg = new BigQMessage(
            this.email,
            this.password,
            "SubscribeChannel",
            this.guid,
            this.serverGuid,
            guid,
            null,
            true,
            null,
            null
        );

        this._watsonSend(msg.toString());

        if (callback) {
            this._removeChannelCallback(guid);
            this.channelCallbacks[guid] = callback;
        }

        return;
    }

    unsubscribeChannel(guid) {
        if (!guid) return;
        var msg = new BigQMessage(
            this.email,
            this.password,
            "UnsubscribeChannel",
            this.guid,
            this.serverGuid,
            guid,
            null,
            true,
            null,
            null
        );

        this._watsonSend(msg.toString());
        this._removeChannelCallback(guid);
        return;
    }

    //</editor-fold>

    //<editor-fold desc="Constructor">

    constructor(hostname, port, ssl, email, password, guid, debug, onConnect, onDisconnect, onMessage) {
        // general variables
        this.hostname = hostname;
        this.port = port;
        this.ssl = ssl;
        this.email = email;
        this.password = password;
        if (!guid) this.guid = this._randomGuid();
        else this.guid = guid;
        this.debug = debug;
        this.serverGuid = "00000000-0000-0000-0000-000000000000";

        // state variables
        this.connected = false;
        this.loggedIn = false;

        // general callbacks
        this.onConnect = onConnect;
        this.onDsconnect = onDisconnect;
        this.onMessage = onMessage;

        // channel callbacks
        this.channelCallbacks = { };

        // initialize watson
        this._log("bigq initializing connection to: " + hostname + ":" + port);
        this._watson = new Watson(
            hostname,
            port,
            ssl,
            false,
            this._onOpen.bind(this),
            this._onClose.bind(this),
            this._onMessage.bind(this),
            this._onError.bind(this));
    }

    //</editor-fold>
};

module.exports = BigQ;
