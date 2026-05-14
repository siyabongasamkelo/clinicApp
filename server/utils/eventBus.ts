// utils/eventBus.ts
import { EventEmitter } from "events";

class EventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(20); // Increase if you have many listeners
  }
}

export const eventBus = new EventBus();
