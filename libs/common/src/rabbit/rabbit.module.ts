import { DynamicModule, Module } from '@nestjs/common';
import { RabbitService } from './rabbit.service';

@Module({})
export class RabbitModule {
    static forRoot(rabbitUrl: string): DynamicModule {
        return {
            module: RabbitModule,
            providers: [
                RabbitService,
                {
                    provide: 'RABBIT_URL',
                    useValue: rabbitUrl,
                },
                {
                    provide: 'RABBIT_INIT',
                    useFactory: async (svc: RabbitService) => {
                        await svc.connect(rabbitUrl);
                        return true;
                    },
                    inject: [RabbitService],
                },
            ],
            exports: [RabbitService],
        };
    }
}