var Long = require("protobufjs").Long;

module.exports = SteamID;

function SteamID(steamID) {
	if("string" == typeof steamID)
		this.long = Long.fromString(steamID, true, 10);
	else if("number" == typeof steamID)
		this.long = Long.fromNumber(steamID, true);
	else if(Buffer.isBuffer(steamID))
		this.long = Long.fromString(steamID.toString("hex"), true, 16);
}

SteamID.ChatInstanceFlags = {
  Clan: 0x100000 >> 1,
  Lobby: 0x100000 >> 2,
  MMSLobby: 0x100000 >> 3,
};

SteamID.prototype.toString = function(radix) {
  return this.long.toString(radix || 10);
};

Object.defineProperties(SteamID.prototype, {
  accountID: {
    get: function() {
      //return this._buffer.readUInt32LE(0);
	  return this.long.getLowBitsUnsigned();
    },
    set: function(value) {
      //this._buffer.writeUInt32LE(value, 0);
	  this.long = Long.fromBits(value, this.long.getHighBitsUnsigned(), true);
    }
  },
  accountInstance: {
    get: function() {
      //return this._buffer.readUInt32LE(4) & 0x000FFFFF;
	  return this.long.getHighBitsUnsigned() & 0x000FFFFF;
    },
    set: function(value) {
      //this._buffer.writeUInt32LE(this._buffer.readUInt32LE(4) & 0xFFF00000 | value, 4);
	  this.long = Long.fromBits(this.long.getLowBitsUnsigned(), (this.long.getHighBitsUnsigned() & 0xFFF00000) | (value & 0x000FFFFF), true);
    }
  },
  accountType: {
    get: function() {
      //return this._buffer[6] >> 4;
	  return (this.long.getHighBitsUnsigned() >> 20) & 0xF;
    },
    set: function(value) {
     // this._buffer[6] = this._buffer[6] & 0x0F | value << 4;
	  this.long = Long.fromBits(this.long.getLowBitsUnsigned(), (this.long.getHighBitsUnsigned() & 0xFF0FFFFF) | ((value & 0xF) << 20), true);
    }
  },
  accountUniverse: {
    get: function() {
      //return this._buffer[7];
	  return (this.long.getHighBitsUnsigned() >> 24) & 0xFF;
    },
    set: function(value) {
      //this._buffer[7] = value;
	  this.long = Long.fromBits(this.long.getLowBitsUnsigned(), (this.long.getHighBitsUnsigned() & 0x00FFFFFF) | ((value & 0xFF) << 24), true);
    }
  }
});
