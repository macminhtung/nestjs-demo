import { ApiProperty } from '@nestjs/swagger';
import { PageOptionsDto } from 'common/dto';

interface IPageMetaDtoParameters<T> {
  pageOptionsDto: PageOptionsDto;
  total: number;
  results: T[];
}

export class PageResponseDto<T> {
  constructor({ pageOptionsDto, total, results }: IPageMetaDtoParameters<T>) {
    const { page, take, isSelectAll } = pageOptionsDto;
    this.page = page;
    this.take = take;
    this.total = total;
    this.pageCount = isSelectAll ? 1 : Math.ceil(total / take) || 1;
    this.hasPreviousPage = page > 1;
    this.hasNextPage = page < this.pageCount;
    this.results = results;
  }

  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly take: number;

  @ApiProperty()
  readonly total: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  @ApiProperty({ type: () => Array<T> })
  readonly results: T[];
}
