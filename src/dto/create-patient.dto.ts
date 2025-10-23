import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreatePatientDTO {

  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;
  
  @IsEmail({}, { message: 'Debe ingresar un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  email: string;

  @IsNotEmpty({ message: 'El numero es obligatoria' })
  @MinLength(10, { message: 'El numero de teléfono debe tener al menos 10 numeros' })
  phone: string;

  @IsNotEmpty({ message: 'La edad es obligatoria' })
  age: number;

  @IsNotEmpty({ message: 'La Direccion es obligatoria' })
  address: string;

}
   