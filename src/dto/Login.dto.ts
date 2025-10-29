import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MaxLength, MinLength } from "class-validator";

export class LoginDTO {
    
    @ApiProperty({example:'example@email.com', description:'Email valido del usuario', required: false})
    @IsEmail()
    email: string;
    
    @ApiProperty({example:'123456', description:'La contraseña debe tener minimo 6 caracteres y máximo 10', required: false})
    @MinLength(6)
    @MaxLength(10)
    password: string;
}