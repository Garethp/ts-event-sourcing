import { DataSource, Repository } from "typeorm";
import { BankEvent, bankEventHandler, hydrateBank } from "../Bank";
import { BankEventEntity } from "./entities/BankEventEntity";

export type SavedBankEvent = BankEvent & { sequenceId: number };

export class EventStore {
  private repository: Repository<BankEventEntity>;

  constructor(dataSource: DataSource) {
    if (!dataSource.isInitialized) {
      throw new Error("The DataSource passed in is not initialized.");
    }

    this.repository = dataSource.getRepository(BankEventEntity);
  }

  async appendEvents(...events: BankEvent[]) {
    const state = hydrateBank(await this.getEvents());
    events.reduce(bankEventHandler, state);

    const newEvents = events.map((event) =>
      this.repository.create({
        type: event.type,
        data: event.data,
      })
    );

    await this.repository.save(newEvents);
  }

  async getEvents(): Promise<SavedBankEvent[]> {
    const events = await this.repository.find();
    return events.map(
      (event) =>
        ({
          sequenceId: event.id,
          type: event.type,
          data: event.data,
        } as SavedBankEvent)
    );
  }
}
