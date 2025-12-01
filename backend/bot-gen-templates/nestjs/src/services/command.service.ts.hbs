import { CommandMessage } from '@app/command/common/command.abstract';
import { CommandStorage } from '@app/command/common/command.storage';
import { HelpCommand } from '@app/command/help.command';
import { CommandInterface } from '@app/types/command.types';
import { extractMessage } from '@app/utils/message';
import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ChannelMessage } from 'mezon-sdk';

@Injectable()
export class CommandService implements CommandInterface {
    public commandList: { [key: string]: CommandMessage };

    constructor(
        private readonly moduleRef: ModuleRef,
    ) { }

    execute(messageContent: string, message: ChannelMessage) {
        const [commandName, args] = extractMessage(messageContent);

        const target = CommandStorage.getCommand(commandName as string);
        if (target) {
            const command = this.moduleRef.get(target);

            if (command) {
                return command.execute(args, message);
            }
        }
    }
}