import { BankAccountEvent } from "./BankAccount";
import { BankEvent, hydrateBank } from "./Bank";

describe("All Accounts Stream", () => {
  it("should handle events for multiple accounts", () => {
    const events: BankAccountEvent[] = [
      { type: "AccountOpened", data: { accountId: "1", owner: "Alice" } },
      { type: "AccountOpened", data: { accountId: "2", owner: "Bob" } },
      { type: "DepositMade", data: { accountId: "1", amount: 100 } },
      { type: "WithdrawalMade", data: { accountId: "1", amount: 25 } },
      { type: "WithdrawalMade", data: { accountId: "1", amount: 50 } },
      { type: "AccountClosed", data: { accountId: "1" } },
      { type: "DepositMade", data: { accountId: "2", amount: 200 } },
      { type: "WithdrawalMade", data: { accountId: "2", amount: 100 } },
      { type: "AccountClosed", data: { accountId: "2" } },
    ];

    expect(hydrateBank(events)).toEqual({
      "1": { balance: 25, status: "closed", owner: "Alice" },
      "2": { balance: 100, status: "closed", owner: "Bob" },
    });
  });

  it("should transfer money between two accounts", () => {
    const events: BankEvent[] = [
      { type: "AccountOpened", data: { accountId: "1", owner: "Alice" } },
      { type: "AccountOpened", data: { accountId: "2", owner: "Bob" } },
      { type: "DepositMade", data: { accountId: "2", amount: 200 } },
      {
        type: "TransferMade",
        data: { fromAccountId: "2", toAccountId: "1", amount: 50 },
      },
    ];

    expect(hydrateBank(events)).toEqual({
      "1": { balance: 50, status: "open", owner: "Alice" },
      "2": { balance: 150, status: "open", owner: "Bob" },
    });
  });
});
