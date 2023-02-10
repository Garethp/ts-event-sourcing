export class EventBus {
  private subscribers: Map<string, Array<Function>> = new Map();

  subscribe(eventType: string, callback: Function) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }

    this.subscribers.get(eventType)?.push(callback);
  }

  publish(event: { type: string; data: any }) {
    if (!this.subscribers.has(event.type)) {
      return;
    }

    this.subscribers.get(event.type)?.forEach((callback) => callback(event));
  }
}
