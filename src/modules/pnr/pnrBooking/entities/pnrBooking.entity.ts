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

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: {
      name: 'unique_pnr',
      msg: 'pnr must be unique.',
    },
    validate: {
      notNull: {
        msg: 'pnr is required.',
      },
      notEmpty: {
        msg: 'pnr cannot be empty.',
      },
      len: {
        args: [3, 50],
        msg: 'pnr must be between 9 and 20 characters.',
      },
    },
  })
  pnr: string;
  @BelongsTo(() => PnrUser)
  pnrUser: PnrUser;
  @HasMany(() => PnrDetails)
  pnrDetails: PnrDetails[];
}

export default PnrBooking;
