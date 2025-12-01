import { Controller, Get } from '@nestjs/common';
import { MezonClientService } from '@app/services/mezon-client.service';

@Controller('health')
export class HealthController {
    constructor(
        private readonly mezonClientService: MezonClientService,
    ) {}

    @Get()
    async check() {
        const timestamp = new Date().toISOString();
        
        try {
            // Check if Mezon client is available
            const client = this.mezonClientService.getClient();
            const hasToken = !!this.mezonClientService.getToken();
            
            return {
                status: 'ok',
                timestamp,
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                services: {
                    mezon: {
                        status: client && hasToken ? 'connected' : 'disconnected',
                        hasClient: !!client,
                        hasToken,
                    },
                    database: {
                        status: 'ok', // Basic check
                    },
                },
                version: '1.0.0',
            };
        } catch (error) {
            return {
                status: 'error',
                timestamp,
                error: error.message,
            };
        }
    }
}
