import { EventStore } from "./infrastructure/EventStore";
import { hydrateBank } from "./Bank";
import DataSource from "../ormconfig";

DataSource.initialize().then(async () => {
  const eventStore = new EventStore(DataSource);

  const events = await eventStore.getEvents();
  const bank = hydrateBank(events);
  console.log(bank);

  return DataSource.destroy();
});
