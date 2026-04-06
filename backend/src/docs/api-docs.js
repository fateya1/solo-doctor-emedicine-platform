"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
var swagger_1 = require("@nestjs/swagger");
function setupSwagger(app) {
    var config = new swagger_1.DocumentBuilder()
        .setTitle('Doctor E-Medicine API')
        .setDescription('API documentation for the Doctor E-Medicine platform')
        .setVersion('1.0')
        .addTag('users')
        .addBearerAuth()
        .build();
    var document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
}
