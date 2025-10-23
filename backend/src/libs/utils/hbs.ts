import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as path from 'path';

export function renderHbs(templatePath: string, context: any = {}): string {
    const fullPath = path.join(__dirname, '../../templates', `${templatePath}.hbs`);
    const source = fs.readFileSync(fullPath, 'utf8');
    const template = Handlebars.compile(source);
    return template(context);
}
