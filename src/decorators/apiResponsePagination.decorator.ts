import { getSchemaPath, ApiOkResponse, ApiExtraModels } from '@nestjs/swagger';
import { applyDecorators, Type } from '@nestjs/common';
import { PageResponseDto } from 'common/dto';

export const ApiResponsePagination = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) =>
  applyDecorators(
    ApiExtraModels(PageResponseDto, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PageResponseDto) },
          {
            properties: {
              results: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );
