import { BankAccountEvent } from "./BankAccount";
import { BankEvent, hydrateBank } from "./Bank";

describe("All Accounts Stream", () => {
  it("should handle events for multiple accounts", () => {
    const events: BankAccountEvent[] = [
      {
        type: "AccountOpened",
        data: { month: 1, accountId: "1", owner: "Alice" },
      },
      {
        type: "AccountOpened",
        data: { month: 1, accountId: "2", owner: "Bob" },
      },
      { type: "DepositMade", data: { month: 1, accountId: "1", amount: 100 } },
      {
        type: "WithdrawalMade",
        data: { month: 1, accountId: "1", amount: 25 },
      },
      {
        type: "WithdrawalMade",
        data: { month: 1, accountId: "1", amount: 50 },
      },
      { type: "AccountClosed", data: { month: 1, accountId: "1" } },
      { type: "DepositMade", data: { month: 1, accountId: "2", amount: 200 } },
      {
        type: "WithdrawalMade",
        data: { month: 1, accountId: "2", amount: 100 },
      },
      { type: "AccountClosed", data: { month: 1, accountId: "2" } },
    ];

    expect(hydrateBank(events)).toEqual({
      "1": { balance: 25, status: "closed", owner: "Alice" },
      "2": { balance: 100, status: "closed", owner: "Bob" },
    });
  });

  it("should transfer money between two accounts", () => {
    const events: BankEvent[] = [
      {
        type: "AccountOpened",
        data: { month: 1, accountId: "1", owner: "Alice" },
      },
      {
        type: "AccountOpened",
        data: { month: 1, accountId: "2", owner: "Bob" },
      },
      { type: "DepositMade", data: { month: 1, accountId: "2", amount: 200 } },
      {
        type: "TransferMade",
        data: { month: 1, fromAccountId: "2", toAccountId: "1", amount: 50 },
      },
    ];

    expect(hydrateBank(events)).toEqual({
      "1": { balance: 50, status: "open", owner: "Alice" },
      "2": { balance: 150, status: "open", owner: "Bob" },
    });
  });
});
