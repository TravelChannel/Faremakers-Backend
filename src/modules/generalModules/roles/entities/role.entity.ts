import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';

@Table
export class Role extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: {
      name: 'unique_role_name',
      msg: 'Role name must be unique.',
    },
    validate: {
      notNull: {
        msg: 'Name is required.',
      },
      notEmpty: {
        msg: 'Name cannot be empty.',
      },
      len: {
        args: [3, 50],
        msg: 'Name must be between 3 and 50 characters.',
      },
    },
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  })
  isActive: boolean;
  @HasMany(() => User)
  users: User[];
}

// You can define associations here if needed

export default Role;
