import { ReplyMezonMessage } from '@domain/common/dtos/MezonReplyMessageDto';
import { MezonClientConfig } from '@domain/common/types/mezon.types';
import { Injectable, Logger } from '@nestjs/common';
import { MezonClient } from 'mezon-sdk';

@Injectable()
export class MezonClientService {
  private readonly logger = new Logger(MezonClientService.name);
  private client: MezonClient;
  public token: string;

  constructor(clientConfigs: MezonClientConfig) {
    this.client = new MezonClient(clientConfigs);
  }

  getToken(): string {
    return this.token;
  }

  async initializeClient(): Promise<void> {
    try {
      const result = await this.client.login();
      this.logger.log('authenticated', result);
      const data = JSON.parse(result);
      this.token = data?.token;
    } catch (error) {
      this.logger.error('error authenticating', error);
      throw error;
    }
  }

  getClient(): MezonClient {
    return this.client;
  }

  async sendMessageToUser(message: ReplyMezonMessage): Promise<any> {
    const user = await  this.client.users.fetch(message.userId);

    if (!user) return;
    try {
      return await user.sendDM(
        {
          t: message?.textContent ?? '',
          ...(message?.messOptions ?? {}),
        },
        message?.code,
      );
    } catch (error) {
      this.logger.error('Error sending message to user', error);
      throw error;
    }
  }

}
