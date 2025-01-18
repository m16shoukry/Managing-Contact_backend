import { EventEmitter } from "events";
import { Response } from "express";

export class SSEService {
  private eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  addClient(channel: string, res: Response) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.write(": keep-alive\n\n");

    const listener = (message: any) => {
      res.write(`data: ${JSON.stringify(message)}\n\n`);
    };

    this.eventEmitter.on(channel, listener);

    res.on("close", () => {
      this.eventEmitter.removeListener(channel, listener);
      res.end();
    });
  }

  broadcast(channel: string, message: any) {
    console.log("Broadcasting message:", message);
    this.eventEmitter.emit(channel, message);
  }
}
