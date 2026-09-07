import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization,Accept',
  });

    const config = new DocumentBuilder()
    .setTitle('App de prueba para verificamex - towa')
    .setDescription('Documentación oficial de los endpoints')
    .setVersion('1.0')
    .addBearerAuth() // Opcional: por si usas tokens JWT
    .build();
    
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, document);
    
    await app.listen(process.env.PORT || 8080, '0.0.0.0');
}
await bootstrap();
