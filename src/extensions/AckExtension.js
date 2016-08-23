/**
 * This client-side extension enables the client to acknowledge to the server
 * the messages that the client has received.
 * For the acknowledgement to work, the server must be configured with the
 * correspondent server-side ack extension. If both client and server support
 * the ack extension, then the ack functionality will take place automatically.
 * By enabling this extension, all messages arriving from the server will arrive
 * via /meta/connect, so the comet communication will be slightly chattier.
 * The fact that all messages will return via /meta/connect means also that the
 * messages will arrive with total order, which is not guaranteed if messages
 * can arrive via both /meta/connect and normal response.
 * Messages are not acknowledged one by one, but instead a batch of messages is
 * acknowledged when the /meta/connect returns.
 */
export default function() {
    var _cometd;
    var _serverSupportsAcks = false;
    var _transientBatch;
    var _size;
    var _batch;

    function _debug(text, args) {
        _cometd._debug(text, args);
    }

    this.registered = function(name, cometd) {
        _cometd = cometd;
        _debug('AckExtension: executing registration callback');
    };

    this.unregistered = function() {
        _debug('AckExtension: executing unregistration callback');
        _cometd = null;
    };

    this.incoming = function(message) {
        var channel = message.channel;
        var ext = message.ext;
        if (channel === '/meta/handshake') {
            if (ext) {
                var ackField = ext.ack;
                if (typeof ackField === 'object') {
                    // New format.
                    _serverSupportsAcks = ackField.enabled === true;
                    var batch = ackField.batch;
                    var size = ackField.size;
                    if (typeof batch === 'number' && typeof size === 'number') {
                        _transientBatch = batch;
                        _size = size;
                    }
                } else {
                    // Old format.
                    _serverSupportsAcks = ackField === true;
                }
            }
            _debug('AckExtension: server supports acknowledgements', _serverSupportsAcks);
        } else if (channel === '/meta/connect' && message.successful && _serverSupportsAcks) {
            if (ext && typeof ext.ack === 'number') {
                _batch = ext.ack;
                _debug('AckExtension: server sent batch', _batch);
            }
        } else if (!/^\/meta\//.test(channel)) {
            if (_size > 0) {
                --_size;
                if (_size == 0) {
                    _batch = _transientBatch;
                    _transientBatch = 0;
                }
            }
        }
        return message;
    };

    this.outgoing = function(message) {
        var channel = message.channel;
        if (!message.ext) {
            message.ext = {};
        }
        if (channel == '/meta/handshake') {
            message.ext.ack = _cometd && _cometd.ackEnabled !== false;
            _serverSupportsAcks = false;
            _transientBatch = 0;
            _batch = 0;
            _size = 0;
        } else if (channel == '/meta/connect') {
            if (_serverSupportsAcks) {
                message.ext.ack = _batch;
                _debug('AckExtension: client sending batch', _batch);
            }
        }
        return message;
    };
};
