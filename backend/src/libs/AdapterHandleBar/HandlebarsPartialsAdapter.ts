import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { existsSync, readdirSync, readFileSync } from 'fs';
import * as Handlebars from 'handlebars';
import { basename, extname, join } from 'path';

export class HandlebarsPartialsAdapter extends HandlebarsAdapter {
    constructor() {
        super();
        this.registerPartials();
    }

    private registerPartials() {
        const partialsDir = join(__dirname, 'templates', 'partials');

        if (!existsSync(partialsDir)) {
            console.warn(`Handlebars partials directory not found: ${partialsDir}`);
            return;
        }

        const files = readdirSync(partialsDir);
        files.forEach((file) => {
            if (extname(file) === '.hbs') {
                const partialName = basename(file, '.hbs');
                const partialTemplate = readFileSync(join(partialsDir, file), 'utf8');
                Handlebars.registerPartial(partialName, partialTemplate);
            }
        });
    }
}