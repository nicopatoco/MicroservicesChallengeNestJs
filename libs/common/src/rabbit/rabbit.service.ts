import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import amqplib, { Channel, Connection, ConsumeMessage } from 'amqplib';

@Injectable()
export class RabbitService implements OnModuleDestroy {
    private readonly logger = new Logger(RabbitService.name);
    private conn?: Connection;
    private channel?: Channel;

    async connect(url: string) {
        this.conn = await amqplib.connect(url);
        this.channel = await this.conn.createChannel();
        this.logger.log('Rabbit connected');
    }

    async assertTopicExchange(exchange: string) {
        if (!this.channel) throw new Error('Rabbit channel not initialized');
        await this.channel.assertExchange(exchange, 'topic', { durable: true });
    }

    async publish(exchange: string, routingKey: string, payload: unknown) {
        if (!this.channel) throw new Error('Rabbit channel not initialized');

        const body = Buffer.from(JSON.stringify(payload));
        const ok = this.channel.publish(exchange, routingKey, body, {
            contentType: 'application/json',
            persistent: true,
        });

        if (!ok) this.logger.warn(`Rabbit publish returned false: ${routingKey}`);
    }

    async subscribeQueue(
        queue: string,
        exchange: string,
        routingKeys: string[],
        onMessage: (msg: unknown, raw: ConsumeMessage) => Promise<void>,
    ) {
        if (!this.channel) throw new Error('Rabbit channel not initialized');

        await this.channel.assertQueue(queue, { durable: true });
        await this.assertTopicExchange(exchange);

        for (const key of routingKeys) {
            await this.channel.bindQueue(queue, exchange, key);
        }

        await this.channel.consume(queue, async (raw) => {
            if (!raw) return;

            try {
                const content = raw.content.toString('utf8');
                const parsed = JSON.parse(content);
                await onMessage(parsed, raw);
                this.channel!.ack(raw);
            } catch (err) {
                this.logger.error(`Rabbit consume error (queue=${queue})`, err as any);
                // Requeue false para evitar loops infinitos en este challenge base
                this.channel!.nack(raw, false, false);
            }
        });
    }

    async onModuleDestroy() {
        try {
            await this.channel?.close();
            await this.conn?.close();
        } catch {
            // ignore
        }
    }
}
