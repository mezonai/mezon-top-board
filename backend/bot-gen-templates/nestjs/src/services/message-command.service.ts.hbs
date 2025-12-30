import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { MezonClient } from 'mezon-sdk';
import { AsyncThrottleQueue } from 'mezon-sdk/dist/cjs/mezon-client/utils/AsyncThrottleQueue';
import { MessageQueue } from './message-queue.service';
import { MezonClientService } from './mezon-client.service';
import { APP_CONSTANTS, ERROR_MESSAGES } from '@app/common/constants';

@Injectable()
export class MessageCommand implements OnModuleDestroy {
    private readonly logger = new Logger(MessageCommand.name);
    private readonly client: MezonClient;
    private readonly throttleQueue = new AsyncThrottleQueue(APP_CONSTANTS.MESSAGE_PROCESSING.THROTTLE_LIMIT);
    private isProcessing = false;

    constructor(
        private readonly messageQueue: MessageQueue,
        private readonly clientService: MezonClientService,
    ) {
        this.client = this.clientService.getClient();
    }

    onModuleDestroy() {
        this.isProcessing = false;
    }

    @Interval(APP_CONSTANTS.MESSAGE_PROCESSING.INTERVAL_MS)
    private processMessages(): void {
        if (this.isProcessing) return;

        this.isProcessing = true;
        try {
            while (this.messageQueue.hasMessages() && this.throttleQueue) {
                const message = this.messageQueue.getNextMessage();
                if (!message) break;

                this.throttleQueue.enqueue(() => this.handleMessage(message));
            }
        } finally {
            this.isProcessing = false;
        }
    }

    private async handleMessage(message: any): Promise<void> {
        try {
            if (message.userId) {
                await this.clientService.sendMessageToUser(message);
            } else {
                await this.clientService.sendMessage(message);
            }
        } catch (error) {
            this.logger.error(ERROR_MESSAGES.MESSAGE_HANDLING, error);
        }
    }
}