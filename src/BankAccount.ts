export type BankAccountState = {
  balance: number;
  status: "open" | "closed";
  owner: string;
};

export type BankAccountEvent =
  | { type: "AccountOpened"; data: { accountId: string; owner: string } }
  | { type: "DepositMade"; data: { accountId: string; amount: number } }
  | { type: "WithdrawalMade"; data: { accountId: string; amount: number } }
  | { type: "AccountClosed"; data: { accountId: string } };

export const bankAccountEventHandler = (
  state: BankAccountState,
  event: BankAccountEvent
): BankAccountState => {
  switch (event.type) {
    case "AccountOpened":
      return {
        balance: 0,
        status: "open",
        owner: event.data.owner,
      };
    case "DepositMade":
      return {
        ...state,
        balance: state.balance + event.data.amount,
      };
    case "WithdrawalMade":
      return {
        ...state,
        balance: state.balance - event.data.amount,
      };
    case "AccountClosed":
      return {
        ...state,
        status: "closed",
      };
    default:
      throw new Error(`Unhandled event: ${event}`);
  }
};

export const hydrateBankAccount = (events: BankAccountEvent[]) =>
  events.reduce(bankAccountEventHandler, {} as BankAccountState);
