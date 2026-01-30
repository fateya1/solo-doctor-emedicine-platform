import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app) {
  const config = new DocumentBuilder()
    .setTitle('Doctor E-Medicine API')
    .setDescription('API documentation for the Doctor E-Medicine platform')
    .setVersion('1.0')
    .addTag('users')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
