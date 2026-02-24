import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CORRELATION_HEADER } from './correlation.types';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
        const incoming = req.headers?.[CORRELATION_HEADER] as string | undefined;
        const correlationId = incoming?.trim() || randomUUID();

        req.correlationId = correlationId;
        res.setHeader(CORRELATION_HEADER, correlationId);

        next();
    }
}