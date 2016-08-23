"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    this.outgoing = function (message) {
        message.timestamp = new Date().toUTCString();
        return message;
    };
};

; /**
   * The timestamp extension adds the optional timestamp field to all outgoing messages.
   */