import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProjectionState {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  public name: string;

  @Column()
  public latestSequenceId: number;
}
