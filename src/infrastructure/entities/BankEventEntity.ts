import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class BankEventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar")
  type: string;

  @Column("jsonb")
  data: any;

  @CreateDateColumn()
  createdAt: Date;
}
