import { NestFactory } from '@nestjs/core';
import { CatalogServiceModule } from './catalog-service.module';

async function bootstrap() {
  const app = await NestFactory.create(CatalogServiceModule);
  await app.listen(3002);
}
bootstrap();
