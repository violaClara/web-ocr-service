import { EventEmitter } from "events";

// Ensure a single instance of the emitter is shared across the server
declare global {
  var _eventEmitter: EventEmitter | undefined;
}

const emitter = global._eventEmitter || new EventEmitter();

if (process.env.NODE_ENV !== "production") {
  global._eventEmitter = emitter;
}

export { emitter };
