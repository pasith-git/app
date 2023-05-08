import { NestFactory } from '@nestjs/core';
import { CustomFilter, ManyExceptionsFilter, PrismaFilter } from 'common/filters/custom.filter';
import helmet from 'helmet';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import {Prisma} from "@prisma/client";

Prisma.Decimal.prototype.toJSON = function() {
  return this.toNumber();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new CustomFilter(), new ManyExceptionsFilter(), new PrismaFilter());
  app.setGlobalPrefix("v1");
  app.enableCors({
    credentials: true,
    origin: true,
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    exposedHeaders: ['X-Total-Count-Temp', 'X-Total-Count-Fixed'],
  });
  app.use(helmet({
    crossOriginResourcePolicy: false,
  }));
  app.use(cookieParser());
  await app.listen(5004);
}
bootstrap();
