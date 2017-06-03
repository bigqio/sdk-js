//
// BigQ Message Class
//

"use strict";

class BigQChannel {

    // <editor-fold desc="Internal methods">

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

    // </editor-fold>

    // <editor-fold desc="Public Methods">

    fromString(json) {
        var obj = JSON.parse(json);
        // if ("key" in myObj)
        if ("ChannelName" in obj) this.channelName = obj["ChannelName"];
        if ("OwnerGUID" in obj) this.ownerGuid = obj["OwnerGUID"];
        if ("ChannelGUID" in obj) this.channelGuid = obj["ChannelGUID"];
        if ("Private" in obj) this.private = obj["Private"];
        if ("Broadcast" in obj) this.broadcast = obj["Broadcast"];
        if ("Multicast" in obj) this.multicast = obj["Multicast"];
        if ("Unicast" in obj) this.unicast = obj["Unicast"];
        return this;
    }

    toString() {
        var json = { };
        json.ChannelName = this.channelName;
        json.OwnerGUID = this.ownerGuid;
        json.ChannelGUID = this.channelGuid;
        json.Private = this.private;
        json.Broadcast = this.broadcast;
        json.Multicast = this.multicast;
        json.Unicast = this.unicast;
        return JSON.stringify(json);
    }

    setBroadcast() {
        this.broadcast = 1;
        this.multicast = 0;
        this.unicast = 0;
    }

    setMulticast() {
        this.broadcast = 0;
        this.multicast = 1;
        this.unicast = 0;
    }

    setUnicast() {
        this.broadcast = 0;
        this.multicast = 0;
        this.unicast = 1;
    }

    // </editor-fold>

    // <editor-fold desc="Constructor">

    constructor(name, priv, ownerGuid) {
        this.channelName = name;
        this.ownerGuid = ownerGuid;
        this.channelGuid = this._randomGuid();
        this.private = priv;
        this.broadcast = 0;
        this.multicast = 0;
        this.unicast = 0;
    }

    // </editor-fold>
};

module.exports = BigQChannel;
