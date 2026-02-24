import { Controller, Get } from '@nestjs/common';

@Controller()
export class PingController {
    @Get('ping')
    ping() {
        return { service: 'users-service', status: 'ok' };
    }
}
