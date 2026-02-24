import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CorrelationModule } from './correlation/correlation.module';
import { MetricsService } from './metrics/metrics.service';
import { MetricsController } from './metrics/metrics.controller';
import { MetricsModule } from './metrics/metrics.module';
import { RabbitService } from './rabbit/rabbit.service';
import { RabbitModule } from './rabbit/rabbit.module';

@Module({
  providers: [CommonService, MetricsService, RabbitService],
  exports: [CommonService],
  imports: [CorrelationModule, MetricsModule, RabbitModule],
  controllers: [MetricsController],
})
export class CommonModule {}
