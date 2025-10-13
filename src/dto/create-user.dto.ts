import { IsEmail, IsInt, IsNotEmpty, IsOptional, Length, Max, Min,} from "class-validator";

export class CreateUserDTO {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(6, 10, {message: 'Password must be between 6 and 10 characters'})
    password: string;

    @IsOptional()
    @IsInt()
    @Min(18, { message: "Age must be at least 18" })
    @Max(100, { message: "Age mustn't exceed 100" })
    age?: number;
}