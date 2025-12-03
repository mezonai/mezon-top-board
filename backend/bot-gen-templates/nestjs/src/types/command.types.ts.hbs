import { ChannelMessage } from 'mezon-sdk';
import { ReplyMezonMessage } from '@app/dtos/MezonReplyMessageDto';

export interface CommandExecutionResult {
    success: boolean;
    response?: ReplyMezonMessage | ReplyMezonMessage[];
    error?: string;
}

export interface CommandMetadata {
    name: string;
    description: string;
    usage: string;
    category?: string;
    aliases?: string[];
    permissions?: string[];
}

export interface ICommand {
    metadata: CommandMetadata;
    execute(
        args: string[],
        message: ChannelMessage,
        commandName?: string,
    ): Promise<CommandExecutionResult> | CommandExecutionResult;
}

export interface CommandInterface {
    execute: (
        messageContent: string,
        message: ChannelMessage,
        commandName?: string,
    ) => ReplyMezonMessage | null | ReplyMezonMessage[] | Promise<ReplyMezonMessage | null | ReplyMezonMessage[]>;
}