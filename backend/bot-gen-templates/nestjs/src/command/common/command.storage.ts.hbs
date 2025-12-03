import { Logger } from '@nestjs/common';
import { CommandMetadata } from '@app/types/command.types';

export class CommandStorage {
    private static readonly logger = new Logger(CommandStorage.name);
    private static commands: Map<string, any> = new Map();
    private static metadata: Map<string, CommandMetadata> = new Map();

    public static registerCommand(commandName: string, commandClass: any, metadata?: CommandMetadata): void {
        if (this.commands.has(commandName)) {
            this.logger.warn(`Command '${commandName}' is already registered. Overriding...`);
        }
        
        this.commands.set(commandName, commandClass);
        
        if (metadata) {
            this.metadata.set(commandName, metadata);
        }
        
        this.logger.debug(`Registered command: ${commandName}`);
    }

    public static getCommand(commandName: string): any | undefined {
        return this.commands.get(commandName);
    }

    public static getAllCommands(): Map<string, any> {
        return new Map(this.commands);
    }

    public static getCommandMetadata(commandName: string): CommandMetadata | undefined {
        return this.metadata.get(commandName);
    }

    public static getAllMetadata(): Map<string, CommandMetadata> {
        return new Map(this.metadata);
    }

    public static hasCommand(commandName: string): boolean {
        return this.commands.has(commandName);
    }

    public static getCommandCount(): number {
        return this.commands.size;
    }

    public static clear(): void {
        this.commands.clear();
        this.metadata.clear();
        this.logger.debug('Cleared all commands');
    }
}