/**
 * The timestamp extension adds the optional timestamp field to all outgoing messages.
 */
export default function() {
    this.outgoing = function(message) {
        message.timestamp = new Date().toUTCString();
        return message;
    };
};
