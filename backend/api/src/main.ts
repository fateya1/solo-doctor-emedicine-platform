import "./instrument";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix + URI versioning: /api/v1/...
  app.setGlobalPrefix("api");
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: "1" });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      const allowed = [/localhost/, /\.vercel\.app$/, /solo-doctor/];
      if (!origin || allowed.some((p) => p.test(origin))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  const config = new DocumentBuilder()
    .setTitle("Solo Doctor eMedicine API")
    .setDescription("Multi-tenant e-medicine platform. Login via POST /api/v1/auth/login to get a Bearer token.")
    .setVersion("1.0.0")
    .setExternalDoc("Versioned base URL: /api/v1/", "/api/v1/")
    .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, "access-token")
    .addTag("Auth", "Registration and login")
    .addTag("Users", "Current user profile")
    .addTag("Doctor", "Doctor profile and availability")
    .addTag("Patient", "Patient profile and appointments")
    .addTag("Appointments", "Booking and cancellation")
    .addTag("Availability", "Doctor slot management")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  // Backward-compat: old /api/ calls still work via the unversioned prefix
  // Frontend can migrate to /api/v1/ incrementally
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log("API running on port " + port);
}

bootstrap();



