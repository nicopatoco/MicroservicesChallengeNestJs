import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly http: HttpHealthIndicator,
        private readonly config: ConfigService,
    ) { }

    @Get()
    @HealthCheck()
    check() {
        const users = this.config.get<string>('USERS_URL')!;
        const catalog = this.config.get<string>('CATALOG_URL')!;
        const orders = this.config.get<string>('ORDERS_URL')!;

        return this.health.check([
            () => this.http.pingCheck('users-service', `${users}/health`),
            () => this.http.pingCheck('catalog-service', `${catalog}/health`),
            () => this.http.pingCheck('orders-service', `${orders}/health`),
        ]);
    }
}