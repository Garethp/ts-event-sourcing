import { BankEvent } from "../Bank";
import DataSource from "../../ormconfig";
import { EventStore } from "./EventStore";

const eventFixtures: BankEvent[] = [
  {
    type: "AccountOpened",
    data: { accountId: "1", month: 1, owner: "John" },
  },
  { type: "DepositMade", data: { accountId: "1", month: 1, amount: 50 } },
  { type: "DepositMade", data: { accountId: "1", month: 2, amount: 100 } },
  { type: "WithdrawalMade", data: { accountId: "1", month: 2, amount: 25 } },
  { type: "WithdrawalMade", data: { accountId: "1", month: 3, amount: 125 } },
  {
    type: "AccountOpened",
    data: { accountId: "2", month: 3, owner: "Jane" },
  },
  {
    type: "DepositMade",
    data: { accountId: "2", month: 3, amount: 100 },
  },
  {
    type: "TransferMade",
    data: { amount: 25, month: 3, fromAccountId: "2", toAccountId: "1" },
  },
];
DataSource.initialize().then(async () => {
  const eventStore = new EventStore(DataSource);

  let events = await eventStore.getEvents();
  if (events.length > 0) return;

  await eventStore.appendEvents(...eventFixtures);

  return DataSource.destroy();
});
