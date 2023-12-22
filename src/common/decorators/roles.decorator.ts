import { SetMetadata } from '@nestjs/common';

export const Roles = (
  permissions: {
    companyTypeId: number;
    companyId: number;
    branchId: number;
    departmentId: number;
    roles?: number[];
  }[],
) => SetMetadata('guardParams', permissions);
// export const Roles = (
//   companyTypeId: number,
//   companyId: number,
//   branchId: number,
//   depId: number,
//   roles: number[],
// ) =>
//   SetMetadata('guardParams', {
//     companyTypeId,
//     companyId,
//     branchId,
//     depId,
//     roles,
//   });
