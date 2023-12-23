import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  // HasMany,
  // BelongsToMany,
} from 'sequelize-typescript';
// import { CompanyBranchDepartmentUserRoles } from '../../company-branch-department-user-roles';
// import { CompanyBranchDepartment } from '../../companyBranch-department';
// import { UserCompanyBranchDepartment } from '../../user-companyBranchDepartment';
import { User } from './user.entity';

@Table
export class UserProfile extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  fatherName: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  birthPlace: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  cnic: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  picture: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  homeAddress: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  homePhone: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mobilePhone: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  emailinfo: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  officialNumber: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  profession: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  experience: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  education: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  HiringDate: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ContactName: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ContactAdress: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ContactPhoneNo: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ContactEmail: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  Relation: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  CNICPicture: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ProfilePicture: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  OfficialNumber2: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    onDelete: 'NO ACTION',
  })
  userId: number;
}

export default UserProfile;
