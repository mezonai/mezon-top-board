import { ClientConfigService } from '@app/config/client.config';
import { ReplyMezonMessage } from '@app/dtos/MezonReplyMessageDto';
import { CommandService } from '@app/services/command.service';
import { MessageQueue } from '@app/services/message-queue.service';
import { MezonClientService } from '@app/services/mezon-client.service';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ChannelMessage, Events, MezonClient } from 'mezon-sdk';
import { ERROR_MESSAGES } from '@app/common/constants';

@Injectable()
export class EventListenerChannelMessage {
    private readonly client: MezonClient;
    private readonly logger = new Logger(EventListenerChannelMessage.name);
    
    constructor(
        private readonly clientService: MezonClientService,
        private readonly clientConfigService: ClientConfigService,
        private readonly commandService: CommandService,
        private readonly messageQueue: MessageQueue,
    ) {
        this.client = clientService.getClient();
    }

    @OnEvent(Events.ChannelMessage)
    async handleCommand(msg: ChannelMessage): Promise<void> {
        if (msg.code) return; // Do not support case edit message
        
        try {
            const content = msg.content.t;
            
            if (typeof content !== 'string' || !content.trim()) {
                return;
            }

            const prefixTrim = content.trim()[0];
            
            if (prefixTrim !== this.clientConfigService.prefix) {
                return;
            }

            const replyMessage = await this.commandService.execute(content, msg);
            
            if (!replyMessage) {
                return;
            }

            const replyMessageArray = Array.isArray(replyMessage)
                ? replyMessage
                : [replyMessage];
                
            for (const mess of replyMessageArray) {
                this.messageQueue.addMessage({
                    ...mess,
                    sender_id: msg.sender_id,
                    message_id: msg.message_id,
                });
            }
        } catch (error) {
            this.logger.error(ERROR_MESSAGES.CHANNEL_MESSAGE_PROCESSING, error);
        }
    }
}