import { ArgsType, Field } from '@nestjs/graphql';
import { IsArray, IsOptional } from 'class-validator';

@ArgsType()
export class GetUsersArgs {
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  ids: string[];
}
