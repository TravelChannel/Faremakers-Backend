import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: {
      name: 'unique_user_username',
      msg: 'Username must be unique.',
    },
    validate: {
      notNull: {
        msg: 'Username is required.',
      },
      notEmpty: {
        msg: 'Username cannot be empty.',
      },
      len: {
        args: [3, 50],
        msg: 'Username must be between 3 and 50 characters.',
      },
    },
  })
  username: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,

    validate: {
      notNull: {
        msg: 'firstName is required.',
      },
      notEmpty: {
        msg: 'firstName cannot be empty.',
      },
      len: {
        args: [3, 50],
        msg: 'firstName must be between 3 and 50 characters.',
      },
    },
  })
  firstName: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,

    validate: {
      notNull: {
        msg: 'lastName is required.',
      },
      notEmpty: {
        msg: 'lastName cannot be empty.',
      },
      len: {
        args: [3, 50],
        msg: 'lastName must be between 3 and 50 characters.',
      },
    },
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: {
      name: 'unique_user_email',
      msg: 'Email must be unique.',
    },
    validate: {
      isEmail: {
        msg: 'Invalid email format.',
      },
    },
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Password is required.',
      },
      notEmpty: {
        msg: 'Password cannot be empty.',
      },
      len: {
        args: [3, 200],
        msg: 'Password must be between 3 and 200 characters.',
      },
    },
  })
  password: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: {
      name: 'contact_user_email',
      msg: 'contact must be unique.',
    },
    validate: {
      notNull: {
        msg: 'contact is required.',
      },
      notEmpty: {
        msg: 'contact cannot be empty.',
      },
      len: {
        args: [3, 200],
        msg: 'contact must be between 3 and 200 characters.',
      },
    },
  })
  contact: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  refreshToken: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imgSrc: string;
  @Column({
    type: DataType.TINYINT,
    defaultValue: 1,
    allowNull: false,
  })
  isActive: number;
  // Define the hasMany association
}

export default User;
