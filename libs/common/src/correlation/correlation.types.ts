export const CORRELATION_HEADER = 'x-correlation-id';

export type CorrelationRequest = Request & {
    correlationId?: string;
};