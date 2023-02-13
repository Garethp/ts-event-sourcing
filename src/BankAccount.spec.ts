import {
  hydrateBankAccount,
  BankAccountEvent,
  BankAccountState,
} from "./BankAccount";

describe("Bank Account Events", () => {
  it("should open an account", () => {
    const events: BankAccountEvent[] = [
      {
        type: "AccountOpened",
        data: { month: 1, accountId: "1", owner: "Alice" },
      },
    ];
    const result: BankAccountState = hydrateBankAccount(events);
    expect(result).toEqual({ balance: 0, status: "open", owner: "Alice" });
  });

  it("should deposit money into an account", () => {
    const events: BankAccountEvent[] = [
      {
        type: "AccountOpened",
        data: { month: 1, accountId: "1", owner: "Alice" },
      },
      { type: "DepositMade", data: { month: 1, accountId: "1", amount: 100 } },
    ];
    const result: BankAccountState = hydrateBankAccount(events);
    expect(result).toEqual({ balance: 100, status: "open", owner: "Alice" });
  });

  it("should withdraw money from an account", () => {
    const events: BankAccountEvent[] = [
      {
        type: "AccountOpened",
        data: { month: 1, accountId: "1", owner: "Alice" },
      },
      { type: "DepositMade", data: { month: 1, accountId: "1", amount: 100 } },
      {
        type: "WithdrawalMade",
        data: { month: 1, accountId: "1", amount: 50 },
      },
    ];
    const result: BankAccountState = hydrateBankAccount(events);
    expect(result).toEqual({ balance: 50, status: "open", owner: "Alice" });
  });

  it("should close an account", () => {
    const events: BankAccountEvent[] = [
      {
        type: "AccountOpened",
        data: { month: 1, accountId: "1", owner: "Alice" },
      },
      { type: "DepositMade", data: { month: 1, accountId: "1", amount: 100 } },
      {
        type: "WithdrawalMade",
        data: { month: 1, accountId: "1", amount: 50 },
      },
      { type: "AccountClosed", data: { month: 1, accountId: "1" } },
    ];
    const result: BankAccountState = hydrateBankAccount(events);
    expect(result).toEqual({ balance: 50, status: "closed", owner: "Alice" });
  });
});
