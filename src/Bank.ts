import {
  BankAccountEvent,
  bankAccountEventHandler,
  BankAccountState,
} from "./BankAccount";

type BankState = {
  [accountId: string]: BankAccountState;
};

export type BankEvent =
  | BankAccountEvent
  | {
      type: "TransferMade";
      data: {
        month: number;
        fromAccountId: string;
        toAccountId: string;
        amount: number;
      };
    };

export const bankEventHandler = (
  state: BankState,
  event: BankEvent
): BankState => {
  switch (event.type) {
    case "AccountOpened":
    case "DepositMade":
    case "WithdrawalMade":
    case "AccountClosed":
      return {
        ...state,
        [event.data.accountId]: bankAccountEventHandler(
          state[event.data.accountId],
          event
        ),
      };
    case "TransferMade":
      const fromAccount = state[event.data.fromAccountId];
      const toAccount = state[event.data.toAccountId];
      if (fromAccount.status === "closed" || toAccount.status === "closed") {
        throw new Error("Cannot transfer between closed accounts");
      }
      if (fromAccount.balance < event.data.amount) {
        throw new Error("Not enough funds to transfer");
      }
      return {
        ...state,
        [event.data.fromAccountId]: {
          ...fromAccount,
          balance: fromAccount.balance - event.data.amount,
        },
        [event.data.toAccountId]: {
          ...toAccount,
          balance: toAccount.balance + event.data.amount,
        },
      };
    default:
      throw new Error(`Unhandled event: ${event}`);
  }
};

export const hydrateBank = (events: BankEvent[]) =>
  events.reduce(bankEventHandler, {});
