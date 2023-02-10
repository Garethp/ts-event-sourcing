import DataSource from "../ormconfig";
import { EventStore } from "./infrastructure/EventStore";
import { EventBus } from "./infrastructure/EventBus";
import { BankEvent } from "./Bank";
import { BankAccountEvent } from "./BankAccount";

DataSource.initialize().then(async () => {
  const eventStore = new EventStore(DataSource);

  let events = await eventStore.getEvents();

  // If we don't have any events, let's add some.
  if (events.length == 0) {
    await eventStore.appendEvents(
      {
        type: "AccountOpened",
        data: {
          accountId: "1",
          owner: "John Doe",
        },
      },
      {
        type: "AccountOpened",
        data: {
          accountId: "2",
          owner: "Jane Doe",
        },
      },
      {
        type: "AccountOpened",
        data: {
          accountId: "3",
          owner: "John Smith",
        },
      },
      {
        type: "AccountClosed",
        data: {
          accountId: "2",
        },
      }
    );

    events = await eventStore.getEvents();
  }

  let openedAccountProjection: string[] = [];

  // We're going to create a projection of all accounts that **are currently open**.
  const eventBus = new EventBus();
  eventBus.subscribe("AccountOpened", (event: BankAccountEvent) => {
    openedAccountProjection.push(event.data.accountId);
  });

  eventBus.subscribe("AccountClosed", (event: BankAccountEvent) => {
    openedAccountProjection = openedAccountProjection.filter(
      (id) => id !== event.data.accountId
    );
  });

  events.forEach((event) => eventBus.publish(event));

  return DataSource.destroy();
});
