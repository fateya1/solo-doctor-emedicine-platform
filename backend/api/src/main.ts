import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix for all API routes
  app.setGlobalPrefix("api");

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") ?? true,
    credentials: true,
  });

  // Swagger — mounted at /docs (outside global prefix)
  const config = new DocumentBuilder()
    .setTitle("Solo Doctor eMedicine API")
    .setDescription(
      "Multi-tenant e-medicine platform. " +
      "Login via POST /api/auth/login to get a Bearer token, then click Authorize.",
    )
    .setVersion("1.0.0")
    .addServer("/", "Default")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "access-token",
    )
    .addTag("Auth", "Registration and login")
    .addTag("Users", "Current user profile")
    .addTag("Doctor", "Doctor profile and availability")
    .addTag("Patient", "Patient profile and appointments")
    .addTag("Appointments", "Booking and cancellation")
    .addTag("Availability", "Doctor slot management")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Fix double-prefix by removing the /api prefix from swagger paths
  const apiPrefix = "api";
  Object.keys(document.paths).forEach((path) => {
    if (path.startsWith("/" + apiPrefix + "/")) {
      const newPath = path.replace("/" + apiPrefix, "");
      document.paths[newPath] = document.paths[path];
      delete document.paths[path];
    }
  });

  SwaggerModule.setup("docs", app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log("API running on port " + port);
  console.log("Swagger docs at /docs");
}

bootstrap();