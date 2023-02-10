import { EventBus } from "./EventBus";

describe("EventBus", () => {
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = new EventBus();
  });

  it("should allow subscribers to receive events", () => {
    const mockHandler = jest.fn();
    eventBus.subscribe("eventType", mockHandler);

    const event = { type: "eventType", data: "test" };
    eventBus.publish(event);

    expect(mockHandler).toHaveBeenCalledWith(event);
  });

  it("should allow multiple subscribers to receive events", () => {
    const mockHandler1 = jest.fn();
    const mockHandler2 = jest.fn();
    eventBus.subscribe("eventType", mockHandler1);
    eventBus.subscribe("eventType", mockHandler2);

    const event = { type: "eventType", data: "test" };
    eventBus.publish(event);

    expect(mockHandler1).toHaveBeenCalledWith(event);
    expect(mockHandler2).toHaveBeenCalledWith(event);
  });

  it("should only call subscribers for relevant events", () => {
    const mockHandler1 = jest.fn();
    const mockHandler2 = jest.fn();
    eventBus.subscribe("eventType1", mockHandler1);
    eventBus.subscribe("eventType2", mockHandler2);

    const event = { type: "eventType1", data: "test" };
    eventBus.publish(event);

    expect(mockHandler1).toHaveBeenCalledWith(event);
    expect(mockHandler2).not.toHaveBeenCalled();
  });

  it("should allow the same handler to be subscribed multiple times to the same event type", () => {
    const mockHandler = jest.fn();
    eventBus.subscribe("eventType", mockHandler);
    eventBus.subscribe("eventType", mockHandler);

    const event = { type: "eventType", data: "test" };
    eventBus.publish(event);

    expect(mockHandler).toHaveBeenCalledTimes(2);
  });

  it("should allow the same handler to be subscribed multiple times to the same event type", () => {
    const mockHandler = jest.fn();
    eventBus.subscribe("eventType", mockHandler);
    eventBus.subscribe("eventType", mockHandler);

    const event = { type: "eventType", data: "test" };
    eventBus.publish(event);

    expect(mockHandler).toHaveBeenCalledTimes(2);
  });

  it("should allow a handler to be subscribed to multiple different event types", () => {
    const mockHandler = jest.fn();
    eventBus.subscribe("eventType1", mockHandler);
    eventBus.subscribe("eventType2", mockHandler);

    const event1 = { type: "eventType1", data: "test1" };
    const event2 = { type: "eventType2", data: "test2" };
    eventBus.publish(event1);
    eventBus.publish(event2);

    expect(mockHandler).toHaveBeenCalledWith(event1);
    expect(mockHandler).toHaveBeenCalledWith(event2);
  });
});
