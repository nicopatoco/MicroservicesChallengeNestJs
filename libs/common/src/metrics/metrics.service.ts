import { Injectable } from '@nestjs/common';
import { Counter, Histogram, Registry, collectDefaultMetrics } from 'prom-client';

@Injectable()
export class MetricsService {
    readonly registry = new Registry();

    readonly httpRequestsTotal: Counter<string>;
    readonly httpRequestDurationMs: Histogram<string>;

    constructor() {
        collectDefaultMetrics({ register: this.registry });

        this.httpRequestsTotal = new Counter({
            name: 'http_requests_total',
            help: 'Total HTTP requests',
            labelNames: ['service', 'method', 'route', 'status'],
            registers: [this.registry],
        });

        this.httpRequestDurationMs = new Histogram({
            name: 'http_request_duration_ms',
            help: 'HTTP request duration in ms',
            labelNames: ['service', 'method', 'route', 'status'],
            buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2000, 5000],
            registers: [this.registry],
        });
    }

    async metricsText(): Promise<string> {
        return this.registry.metrics();
    }
}
