import * as fs from 'fs';
import { join, basename } from 'path';
import * as archiver from 'archiver';
import * as Handlebars from 'handlebars';
import { BotWizardRequest, CommandWizardRequest, EventWizardRequest } from '@features/bot-generator/dtos/request';

export class BotTemplateBuilder {
  static async renderDirectory(srcDir: string, destDir: string, payload: BotWizardRequest) {
    const items = await fs.promises.readdir(srcDir);

    for (const item of items) {
      const srcPath = join(srcDir, item);
      let destPath = join(destDir, item);
      const stat = await fs.promises.stat(srcPath);

      if (item === 'integrations' && stat.isDirectory()) {
        await this.renderIntegrationFiles(srcPath, destPath, payload);
        continue;
      }

      if (stat.isDirectory()) {
        await fs.promises.mkdir(destPath, { recursive: true });
        await this.renderDirectory(srcPath, destPath, payload);
        continue;
      }

      if (item.endsWith('.hbs')) {
        const content = await fs.promises.readFile(srcPath, 'utf8');
        Handlebars.registerHelper('includes', function (array, value, options) {
          if (Array.isArray(array) && array.includes(value)) {
            return options.fn(this);
          }
          return options.inverse(this);
        });
        Handlebars.registerHelper('hasEvent', function (events, name, options) {
          if (!Array.isArray(events)) return false;
          return events.some(e => e.eventName === name) ? options.fn(this) : '';
        });
        const template = Handlebars.compile(content);
        const rendered = template(payload);

        destPath = join(destDir, basename(item, '.hbs'));

        await fs.promises.writeFile(destPath, rendered);
        continue;
      }
      await fs.promises.copyFile(srcPath, destPath);
    }
  }

  static async renderIntegrationFiles(srcIntegrationDir: string, destIntegrationDir: string, payload: BotWizardRequest) {
    const allowedIntegrations = payload.integrations ?? [];

    if (allowedIntegrations.length === 0) {
      return;
    }

    await fs.promises.mkdir(destIntegrationDir, { recursive: true });

    for (const integration of allowedIntegrations) {
      const srcPath = join(srcIntegrationDir, integration);
      const destPath = join(destIntegrationDir, integration);

      if (!fs.existsSync(srcPath)) continue;

      await fs.promises.mkdir(destPath, { recursive: true });
      await this.renderDirectory(srcPath, destPath, payload);
    }
  }

  static async generateEventListeners(baseOutputDir: string, events: EventWizardRequest[], template: string, ext = "ts") {
    if (!Array.isArray(events) || events.length === 0) return;

    const listenersDir = join(baseOutputDir, "src", "listeners");
    await fs.promises.mkdir(listenersDir, { recursive: true });

    for (const event of events) {
      const eventNameCutSuffix = event.eventName.replace(/Event$/, "");
      const eventListenerFileName = eventNameCutSuffix
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
        .toLowerCase();
      const context = {
        eventName: event.eventName,
        eventType: event.eventType,
        eventClass: `EventListener${eventNameCutSuffix}`
      }
      const compile = Handlebars.compile(template);
      const rendered = compile(context);
      const filePath = join(listenersDir, `${eventListenerFileName}.listener.${ext}`);
      await fs.promises.writeFile(filePath, rendered);
    }
  }

  static async generateCommandFiles(baseOutputDir: string, commands: CommandWizardRequest[], template: string, ext = 'ts') {
    if (!Array.isArray(commands) || commands.length === 0) return;

    const commandsDir = join(baseOutputDir, 'src', 'command');
    await fs.promises.mkdir(commandsDir, { recursive: true });

    for (const cmd of commands) {
      const context = {
        command: cmd.command,
        description: cmd.description,
        category: cmd.category,
        aliases: cmd.aliases,
        className: `${cmd.command.charAt(0).toUpperCase() + cmd.command.slice(1)}Command`
      }
      const compile = Handlebars.compile(template);
      const rendered = compile(context);
      const filePath = join(commandsDir, `${cmd.command}.command.${ext}`);
      await fs.promises.writeFile(filePath, rendered);
    }
  }

  static async zipFolder(folderPath: string): Promise<Buffer> {
    const zipPath = `${folderPath}.zip`;

    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', async () => {
        const buffer = await fs.promises.readFile(zipPath);
        await fs.promises.rm(zipPath);
        resolve(buffer);
      });

      archive.on('warning', console.warn);
      archive.on('error', reject);

      archive.pipe(output);
      archive.directory(folderPath, false);

      archive.finalize();
    });
  }
}