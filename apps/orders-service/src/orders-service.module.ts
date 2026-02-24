import { CorrelationModule } from '@app/common/correlation/correlation.module';
import { MetricsModule } from '@app/common/metrics/metrics.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';
import { OrdersServiceController } from './orders-service.controller';
import { OrdersServiceService } from './orders-service.service';
import { PingController } from './ping/ping.controller';

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
  ],
  controllers: [OrdersServiceController, PingController, HealthController],
  providers: [OrdersServiceService],
})
export class OrdersServiceModule { }
