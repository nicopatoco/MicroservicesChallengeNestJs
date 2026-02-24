import { CorrelationModule } from '@app/common/correlation/correlation.module';
import { MetricsModule } from '@app/common/metrics/metrics.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { CatalogServiceController } from './catalog-service.controller';
import { CatalogServiceService } from './catalog-service.service';
import { HealthController } from './health/health.controller';
import { PingController } from './ping/ping.controller';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),

    TerminusModule,
    CorrelationModule,
    MetricsModule,
    ProductsModule,
  ],
  controllers: [CatalogServiceController, HealthController, PingController],
  providers: [CatalogServiceService],
})
export class CatalogServiceModule { }
