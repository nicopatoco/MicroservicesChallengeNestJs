import { CorrelationModule } from '@app/common/correlation/correlation.module';
import { MetricsModule } from '@app/common/metrics/metrics.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';
import { PingController } from './ping/ping.controller';
import { UsersServiceController } from './users-service.controller';
import { UsersServiceService } from './users-service.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),

  MongooseModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      uri: config.get<string>('MONGO_URI'),
    }),
  }),

    TerminusModule,
    CorrelationModule,
    MetricsModule,],
  controllers: [UsersServiceController, HealthController, PingController],
  providers: [UsersServiceService],
})
export class UsersServiceModule { }
