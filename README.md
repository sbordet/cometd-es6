# cometd-es6

A implementation of the [CometD](https://github.com/cometd/cometd) client library as an ES6 module.

This library does not include the Dojo or jQuery plugins, and as such, the long-poll and JSONP transports don't work out of the box. You can find the jQuery-based plugin at [cometd-transport-jquery](https://github.com/seansfkelley/cometd-transport-jquery).

## Usage

```js
import CometD, { WebSocketTransport } from 'cometd';
import { CallbackPollingTransport, LongPollingTransport } from 'cometd-transport-jquery';

// Borrowed from https://github.com/cometd/cometd/blob/master/cometd-javascript/jquery/src/main/webapp/jquery/jquery.cometd.js#L93
// Registration order is important. Transports will be tried in the order they are added.
const cometd = new CometD();
if (window.WebSocket) {
  cometd.registerTransport('websocket', new WebSocketTransport());
}
cometd.registerTransport('long-polling', new LongPollingTransport());
cometd.registerTransport('callback-polling', new CallbackPollingTransport());

cometd.configure({ ... });
cometd.handshake();
cometd.publish('/channel', { ... });
```

## Development

For the time being, I plan to track the official CometD implementation. Please send suggestions and bug reports their way unless they are obviously related to this port.