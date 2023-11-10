import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @IsString()
  displayName: string;

  @Field({ nullable: true })
  @IsString()
  firstName: string;

  @Field({ nullable: true })
  @IsString()
  lastName: string;
}
