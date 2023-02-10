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
