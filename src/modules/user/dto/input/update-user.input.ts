import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field()
  @IsNotEmpty()
  id: string;

  @Field()
  @IsOptional()
  @IsNumber()
  age: number;

  @Field()
  @IsOptional()
  isSubcribed: boolean;
}
