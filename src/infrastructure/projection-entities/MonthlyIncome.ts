import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MonthlyIncome {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  public accountId: string;

  @Column()
  public month: number;

  @Column()
  public amount: number;
}
