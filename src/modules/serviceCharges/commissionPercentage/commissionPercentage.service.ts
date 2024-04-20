/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { CreateCommissionPercentageDto } from './dto/create-commissionPercentage.dto';
import { UpdateCommissionPercentageDto } from './dto/update-commissionPercentage.dto';
import { COMMISSION_PERCENTAGE_REPOSITORY } from '../../../shared/constants';
import { CommissionPercentage } from './entities/commissionPercentage.entity';
import {
  Op,
  sequelize,
  Transaction,
} from '../../../database/sequelize.provider'; // Adjust the path accordingly
import { ResponseService } from '../../../common/utility/response/response.service';
import { EXCEPTION } from '../../../shared/messages.constants';
import { Airline } from '../airline';
import { FareClass } from '../fareClass';
import { Sector } from '../sector';
import { CommissionCategories } from '../commissionCategories';
// import { ToggleIsActiveDto } from 'src/shared/dtos/toggleIsActive.dto';

@Injectable()
export class CommissionPercentageService {
  constructor(
    @Inject(COMMISSION_PERCENTAGE_REPOSITORY)
    private commissionPercentageRepository: typeof CommissionPercentage,
    private readonly responseService: ResponseService,
  ) {}
  // Test
  async create(createCommissionPercentageDto: CreateCommissionPercentageDto) {
    const t: Transaction = await sequelize.transaction();

    try {
      const newRole = await this.commissionPercentageRepository.create(
        {
          percentage: createCommissionPercentageDto.percentage ?? 0,
          airlineId: createCommissionPercentageDto.airlineId ?? null,
          fareClassId: createCommissionPercentageDto.fareClassId ?? null,
          sectorId: createCommissionPercentageDto.sectorId ?? null,

          startDate: createCommissionPercentageDto.startDate ?? null,
          endDate: createCommissionPercentageDto.endDate ?? null,
        },
        { transaction: t },
      );

      await t.commit();

      return this.responseService.createResponse(
        HttpStatus.OK,
        newRole,
        'CommissionPercentage Added',
      );
    } catch (error) {
      await t.rollback();
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }

  async findAll(): Promise<CommissionPercentage[]> {
    try {
      const currentDate = new Date();

      const commissionPercentage =
        await this.commissionPercentageRepository.findAll({
          where: {
            isActive: true,
            startDate: {
              [Op.lte]: currentDate, // Less than or equal to the current date
            },
            endDate: {
              [Op.gte]: currentDate, // Greater than or equal to the current date
            },
          },
          include: [
            {
              model: Airline,
            },
            {
              model: Sector,
            },
            {
              model: FareClass,
            },
          ],
        });
      return this.responseService.createResponse(
        HttpStatus.OK,
        commissionPercentage,
        'commissionPercentage Fetched',
      );
    } catch (error) {
      // await t.rollback();
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        EXCEPTION,
      );
    }
  }

  async findOne(id: number) {
    try {
      const commissionPercentage =
        await this.commissionPercentageRepository.findByPk(id, {
          include: [
            {
              model: Airline,
            },
            {
              model: Sector,
            },
            {
              model: FareClass,
            },
          ],
        });
      return this.responseService.createResponse(
        HttpStatus.OK,
        { ...commissionPercentage.toJSON() },
        'commissionPercentage retrieved successfully',
      );
    } catch (error) {
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  async getServiceCharges(majorInfo) {
    try {
      const pnrServiceChargesPercentage = await this.calculateServiceCharges(
        majorInfo,
      );
      return this.responseService.createResponse(
        HttpStatus.OK,
        pnrServiceChargesPercentage,
        'Service Charges calculated successfully',
      );
    } catch (error) {
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  async calculateServiceCharges(MajorInfo) {
    let pnrServiceChargesPercentage = 0;
    let pnrServiceChargesPercentageDefault = 0;
    const commissionCategory = await CommissionCategories.findOne({
      order: [['precedence', 'ASC']],
    });
    console.log('commissionCategory', commissionCategory);
    if (commissionCategory) {
      const commissionPercentage = await CommissionPercentage.findOne({
        where: {
          airlineId: null,
          fareClassId: null,
          sectorId: null,
        },
      });
      if (commissionPercentage) {
        pnrServiceChargesPercentageDefault = pnrServiceChargesPercentage =
          commissionPercentage.percentage;
      }
      let pnrServiceChargesCode = 'default';
      // let a = 1;
      console.log(
        'pnrServiceChargesPercentageDefault',
        pnrServiceChargesPercentageDefault,
      );
      console.log('commissionCategory.id', commissionCategory.id);
      switch (Number(commissionCategory.id)) {
        case 1:
          pnrServiceChargesCode = MajorInfo.OperatingAirline[0] ?? null;
          console.log('pnrServiceChargesCode', pnrServiceChargesCode);
          const airline = await Airline.findOne({
            where: { code: pnrServiceChargesCode },
          });

          if (airline) {
            let commissionPercentage = await CommissionPercentage.findOne({
              where: {
                airlineId: airline.id,
                fareClassId: null,
                sectorId: null,
              },
            });
            if (commissionPercentage) {
              pnrServiceChargesPercentage = commissionPercentage.percentage;
            } else {
              commissionPercentage = await CommissionPercentage.findOne({
                where: {
                  airlineId: airline.id,
                },
              });
              if (commissionPercentage) {
                pnrServiceChargesPercentage = commissionPercentage.percentage;
              }
            }
            console.log('commissionPercentage', commissionPercentage);
          }
          break;

        case 2:
          pnrServiceChargesCode = MajorInfo.Destinations[0] ?? null;
          const sector = await Sector.findOne({
            where: { code: pnrServiceChargesCode },
          });

          if (sector) {
            let commissionPercentage = await CommissionPercentage.findOne({
              where: {
                sectorId: sector.id,
                airlineId: null,
                fareClassId: null,
              },
            });

            if (commissionPercentage) {
              pnrServiceChargesPercentage = commissionPercentage.percentage;
            } else {
              commissionPercentage = await CommissionPercentage.findOne({
                where: {
                  sectorId: sector.id,
                },
              });
              if (commissionPercentage) {
                pnrServiceChargesPercentage = commissionPercentage.percentage;
              }
            }
          }

          break;
        case 3:
          pnrServiceChargesCode = MajorInfo.ClassType[0] ?? null;

          const fareClass = await FareClass.findOne({
            where: { code: pnrServiceChargesCode },
          });

          if (fareClass) {
            let commissionPercentage = await CommissionPercentage.findOne({
              where: {
                fareClassId: fareClass.id,
                sectorId: null,
                airlineId: null,
              },
            });

            if (commissionPercentage) {
              pnrServiceChargesPercentage = commissionPercentage.percentage;
            } else {
              commissionPercentage = await CommissionPercentage.findOne({
                where: {
                  fareClassId: fareClass.id,
                },
              });
              if (commissionPercentage) {
                pnrServiceChargesPercentage = commissionPercentage.percentage;
              }
            }
          }
          break;

        default:
          pnrServiceChargesPercentage = pnrServiceChargesPercentageDefault;
          break;
      }
    }
    return pnrServiceChargesPercentage;
  }
  async update(
    id: number,
    updateCommissionPercentageDto: UpdateCommissionPercentageDto,
  ) {
    const t = await sequelize.transaction(); // Start the transaction

    try {
      return this.responseService.createResponse(
        HttpStatus.NOT_FOUND,
        null,
        'CommissionPercentage Not Found',
      );
      t.commit();
      return this.responseService.createResponse(
        HttpStatus.OK,
        null,
        'CommissionPercentage updated successfully',
      );
    } catch (error) {
      await t.rollback();
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }

  async remove(id: number): Promise<void> {
    const t: Transaction = await sequelize.transaction();

    try {
      const commissionPercentage =
        await this.commissionPercentageRepository.findByPk(id);
      if (!commissionPercentage) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'commissionPercentage not found',
        );
      }

      await commissionPercentage.destroy({ transaction: t });
      await t.commit();

      return this.responseService.createResponse(
        HttpStatus.OK,
        null,
        'Success',
      );
    } catch (error) {
      await t.rollback();

      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  async getAirlineDropdown() {
    try {
      const dropdownsArray = await Airline.findAll({});
      let dropdown = [];

      dropdown = dropdownsArray.map((item) => ({
        id: item.id,
        name: `${item.code}-${item.name}`,
      }));
      return this.responseService.createResponse(
        HttpStatus.OK,
        dropdownsArray,
        'Success',
      );
    } catch (error) {
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        EXCEPTION,
      );
    }
  }
  async getSectorDropdown() {
    try {
      const dropdownsArray = await Sector.findAll({});
      let dropdown = [];

      dropdown = dropdownsArray.map((item) => ({
        id: item.id,
        name: `${item.code}-${item.name}`,
      }));
      return this.responseService.createResponse(
        HttpStatus.OK,
        dropdownsArray,
        'Success',
      );
    } catch (error) {
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        EXCEPTION,
      );
    }
  }
  async getFareClassDropdown() {
    try {
      const dropdownsArray = await FareClass.findAll({});
      let dropdown = [];

      dropdown = dropdownsArray.map((item) => ({
        id: item.id,
        name: `${item.code}-${item.name}`,
      }));
      return this.responseService.createResponse(
        HttpStatus.OK,
        dropdownsArray,
        'Success',
      );
    } catch (error) {
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        EXCEPTION,
      );
    }
  }
  async toggleStatus(id: number): Promise<any> {
    const t: Transaction = await sequelize.transaction();

    try {
      const whereOptions: any = {};
      whereOptions.id = id;

      const commissionPercentage =
        await this.commissionPercentageRepository.findOne({
          where: whereOptions,
        });
      if (!commissionPercentage) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'Record not found',
        );
      }

      commissionPercentage.isActive = !commissionPercentage.isActive;

      await commissionPercentage.save({ transaction: t }); // Save the changes
      await t.commit();
      let message = '';
      if (commissionPercentage.isActive || false === false) {
        message = 'CommissionPercentage deactivated successfully';
      } else {
        message = 'CommissionPercentage activated successfully';
      }
      return this.responseService.createResponse(HttpStatus.OK, null, message);
    } catch (error) {
      await t.rollback();
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
}
