//
// BigQ Message Class
//

"use strict";

class BigQMessage {

    //
    // Internal methods
    //

    _log(msg) {
        if (this.debug) console.log(msg);
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
            ("00" + date.getUTCSeconds()).slice(-2) + "." +
            "0000000";
        return ret;
    }

    toString() {
        var ret = "";
        var newLine = "\r\n";
        var dataLen = 0;
        if (this.data) dataLen = this.data.length;

        if (this.email) ret += "Email: " + this.email + newLine;
        if (this.password) ret += "Password: " + this.password + newLine;
        if (this.command) ret += "Command: " + this.command + newLine;
        ret += "SenderGUID: " + this.senderGuid + newLine;
        if (this.recipientGuid) ret += "RecipientGUID: " + this.recipientGuid + newLine;
        if (this.channelGuid) ret += "ChannelGUID: " + this.channelGuid + newLine;
        if (this.messageGuid) ret += "MessageID: " + this.messageGuid + newLine;
        if (this.createdUtc) ret += "CreatedUtc: " +this.createdUtc + newLine;
        ret += "SyncRequest: " + (this.syncRequest == "true") + newLine;

        if (this.contentType) ret += "ContentType: " + this.contentType + newLine;
        else ret += "ContentType: application/octet-stream" + newLine;
        ret += "ContentLength: " + dataLen + newLine;
        ret += newLine;   // end of headers

        if (this.data) ret += this.data;
        return ret;
    }

    fromString(data) {
        if (!data) {
            _log("fromString null data");
            return null;
        }
        else {
            data = data.toString();
            var dataFound = false;
            var newLine = "\r\n";
            var currData = data;
            var ret = { };

            while (!dataFound) {
                var newLinePosition = currData.indexOf(newLine);
                if (newLinePosition == 0) {
                    //
                    // end of headers
                    //
                    currData = currData.substring(2, currData.length);
                    this.data = currData;
                    dataFound = true;
                }
                else {
                    //
                    // read until newLine
                    //
                    var currLine = currData.substring(0, newLinePosition);
                    currData = currData.substring(newLinePosition + 2, currData.length);

                    var header = currLine.split(":");
                    if (header.length != 2) continue;   // not a valid header line

                    var key = header[0].trim().toLowerCase();
                    var val = header[1].trim();

                    switch (key) {
                        case "email":
                            this.email = val;
                            break;

                        case "password":
                            this.password = val;
                            break;

                        case "command":
                            this.command = val;
                            break;

                        case "createdutc":
                            this.createdUtc = val;
                            break;

                        case "success":
                            this.success = val;
                            break;

                        case "senderguid":
                            this.senderGuid = val;
                            break;

                        case "recipientguid":
                            this.recipientGuid = val;
                            break;

                        case "channelguid":
                            this.channelGuid = val;
                            break;

                        case "messageguid":
                            this.messageGuid = val;
                            break;

                        case "conversationid":
                            this.conversationId = val;
                            break;

                        case "messageseqnum":
                            this.messageSeqnum = val;
                            break;

                        case "syncrequest":
                            this.syncRequest = val;
                            break;

                        case "syncresponse":
                            this.syncResponse = val;
                            break;

                        case "synctimeoutms":
                            this.syncTimeoutMs = val;
                            break;

                        case "contenttype":
                            this.contentType = val;
                            break;

                        case "contentlength":
                            this.contentLength = val;
                            break;

                        default:
                            this._log("bigqmessage unknown key " + key);
                            break;
                    }
                }
            }

            return this;
        }
    }

    //
    // External methods
    //

    //
    // Constructor
    //

    constructor(email, password, command, senderGuid, recipientGuid, channelGuid, sync, contentType, data) {
        this.email = email;
        this.password = password;
        this.command = command;
        this.senderGuid = senderGuid;
        this.recipientGuid = recipientGuid;
        this.channelGuid = channelGuid;
        this.messageGuid = this._randomGuid();
        this.syncRequest = sync;
        this.contentType = contentType;
        this.data = data;
        this.createdUtc = this._timestamp();
        this.debug = false;
    }
};

module.exports = BigQMessage;
