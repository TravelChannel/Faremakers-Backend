import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';

import { PnrUser } from '../../pnrUsers';
import { PnrDetails } from '../../PnrDetails';

@Table
export class PnrBooking extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => PnrUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    onDelete: 'NO ACTION',
  })
  pnrUserId: number;

  @BelongsTo(() => PnrUser)
  pnrUser: PnrUser;
  @HasMany(() => PnrDetails)
  pnrDetails: PnrDetails[];
}

export default PnrBooking;
