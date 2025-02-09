import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CurrencyAlert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 15 })
  pair: string;

  @Column({ type: 'varchar' })
  previous_alert_rate: string;

  @Column({ type: 'varchar' })
  rate: string;

  @Column({ type: 'varchar' })
  threshold: string;

  @CreateDateColumn()
  timestamp?: Date;
}
