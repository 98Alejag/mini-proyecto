import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configDoc =  new DocumentBuilder()
    .setTitle('API MiniProyecto Odontología')
    .setDescription('Documentación de la API desarrollada en NestJS para la clase MujeresDigitales')
    .setVersion('1.3')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, configDoc);
  SwaggerModule.setup('/api/docs', app, document )  

  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true,
    transformOptions: { enableImplicitConversion: true } 
  }))

  // Interceptor global para ocultar campos con @Exclude()
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const port = process.env.PORT || 3000

  await app.listen(port);

  console.log(`App running on: http://localhost:${port}`)
}
bootstrap();
