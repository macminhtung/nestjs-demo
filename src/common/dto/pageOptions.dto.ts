import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsArray,
  IsDateString,
  Max,
  Min,
  IsBoolean,
} from 'class-validator';
import { OrderEnum, BooleanEnum } from 'common/enums';
import { Transform } from 'class-transformer';

export const NUM_LIMIT_RECORDS = 100000;
export const DEFAULT_PAGE_NUM = 1;
export const DEFAULT_PAGE_TAKE = 30;

export class PageOptionsDto {
  @ApiPropertyOptional({
    enum: OrderEnum,
    default: OrderEnum.DESC,
    description: 'Use to sort records based on createdAt',
  })
  @IsOptional()
  @IsEnum(OrderEnum)
  order: OrderEnum;

  @ApiPropertyOptional({
    description: 'Page number',
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => +value)
  @IsInt()
  @Min(DEFAULT_PAGE_NUM)
  readonly page: number;

  @ApiPropertyOptional({
    description: 'Maximum number of records to be received',
    default: DEFAULT_PAGE_TAKE,
  })
  @IsOptional()
  @Transform(({ value }) => +value)
  @IsInt()
  @Min(1)
  @Max(100)
  readonly take: number;

  @ApiPropertyOptional({
    description: 'The keyword to search',
  })
  @IsOptional()
  @IsString()
  readonly keySearch?: string;

  @ApiPropertyOptional({
    enum: BooleanEnum,
    description: 'Use to filter records was deleted',
  })
  @IsOptional()
  @Transform(({ value }) => value === BooleanEnum.TRUE)
  @IsBoolean()
  readonly isDeleted?: boolean;

  @ApiPropertyOptional({
    description: 'Use to filter records based on list ID',
  })
  @IsOptional()
  @IsArray()
  readonly ids?: string[] | number[];

  @ApiPropertyOptional({
    description: 'Use to filter records with createdFrom >= createdAt',
  })
  @IsOptional()
  @IsDateString()
  readonly createdFrom?: string;

  @ApiPropertyOptional({
    description: 'Use to filter records with createdFrom < createdAt',
  })
  @IsOptional()
  @IsDateString()
  readonly createdTo?: string;

  @ApiPropertyOptional({
    enum: BooleanEnum,
    description: `Use to get all records (MAX: ${NUM_LIMIT_RECORDS} records)`,
  })
  @IsOptional()
  @Transform(({ value }) => value === BooleanEnum.TRUE)
  @IsBoolean()
  readonly isSelectAll?: boolean;
}
