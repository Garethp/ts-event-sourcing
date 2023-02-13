export class EventBus {
  private subscribers: Map<string, Array<Function>> = new Map();

  subscribe(eventType: string, callback: Function) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }

    this.subscribers.get(eventType)?.push(callback);
  }

  async publish(event: { type: string; data: any }) {
    if (!this.subscribers.has(event.type)) {
      return;
    }

    for (const callback of this.subscribers.get(event.type) ?? []) {
      await callback(event);
    }
  }
}
