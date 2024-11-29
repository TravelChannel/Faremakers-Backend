import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('PayzenTokens')
export class PayzenToken {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'nvarchar', length: 'max' })
  Token: string;

  @Column({ type: 'datetime' })
  ExpiryTime: Date;

  @CreateDateColumn({ type: 'datetime' })
  CreatedAt: Date;
}
