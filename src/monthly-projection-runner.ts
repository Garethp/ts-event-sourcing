import DataSource from "../ormconfig";
import ProjectionDataSource from "../ormconfig-projections";
import { EventStore } from "./infrastructure/EventStore";
import { EventBus } from "./infrastructure/EventBus";
import { monthlyIncomeProjection } from "./monthly-income-projection";

DataSource.initialize()
  .then(() => ProjectionDataSource.initialize())
  .then(async () => {
    const eventStore = new EventStore(DataSource);

    let events = await eventStore.getEvents();

    // If we don't have any events, let's add some.
    if (events.length == 0) {
      throw new Error("Please run the fixture data");
    }

    const eventBus = new EventBus();
    eventBus.subscribe("DepositMade", monthlyIncomeProjection);
    eventBus.subscribe("WithdrawalMade", monthlyIncomeProjection);

    for (const event of events) {
      await eventBus.publish(event);
    }

    await DataSource.destroy();
    await ProjectionDataSource.destroy();
  });
