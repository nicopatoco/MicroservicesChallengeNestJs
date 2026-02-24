import { CorrelationModule } from '@app/common/correlation/correlation.module';
import { MetricsModule } from '@app/common/metrics/metrics.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { PingController } from './ping/ping.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    TerminusModule,
    CorrelationModule,
    MetricsModule,
  ],
  controllers: [AppController, HealthController, PingController],
  providers: [AppService],
})
export class AppModule { }
