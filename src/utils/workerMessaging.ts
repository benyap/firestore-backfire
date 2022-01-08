import { MessagePort, Worker } from "worker_threads";

class Messenger<Message> {
  createMessage(message: Message) {
    return message;
  }
}

export class ToWorkerMessenger<Message> extends Messenger<Message> {
  send(worker: Worker, message: Message) {
    worker.postMessage(message);
  }
}

export class ToParentMessenger<
  Message,
  ReceivingMessage
> extends Messenger<Message> {
  constructor(private parentPort: MessagePort | null) {
    super();
  }

  send(message: Message) {
    this.parentPort?.postMessage(message);
  }

  onMessage(listener: (message: ReceivingMessage) => any) {
    this.parentPort?.removeAllListeners();
    this.parentPort?.addListener("message", listener);
  }
}
