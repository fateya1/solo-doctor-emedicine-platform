import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Allow all Vercel preview URLs + localhost
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      const allowed = [
        /localhost/,
        /\.vercel\.app$/,
        /solo-doctor/,
      ];
      if (!origin || allowed.some((pattern) => pattern.test(origin))) {
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

  Object.keys(document.paths).forEach((path) => {
    if (path.startsWith("/api/")) {
      const newPath = path.replace("/api", "");
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