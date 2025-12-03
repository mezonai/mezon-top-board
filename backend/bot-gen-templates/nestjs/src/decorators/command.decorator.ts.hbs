import { CommandStorage } from "@app/command/common/command.storage";
import { CommandMetadata } from "@app/types/command.types";

export function Command(commandName: string, metadata?: Partial<CommandMetadata>) {
    return function (target: any) {
        const fullMetadata: CommandMetadata = {
            name: commandName,
            description: metadata?.description || `${commandName} command`,
            usage: metadata?.usage || `!${commandName}`,
            category: metadata?.category || 'General',
            aliases: metadata?.aliases || [],
            permissions: metadata?.permissions || [],
        };
        
        CommandStorage.registerCommand(commandName, target, fullMetadata);
    };
}