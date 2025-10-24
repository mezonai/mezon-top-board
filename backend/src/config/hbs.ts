import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as path from 'path';

export const configHbsPartials = () => {
  const partialsDir = path.join(process.cwd(), 'dist', 'templates', 'partials');
  fs.readdirSync(partialsDir).forEach((file) => {
    const filePath = path.join(partialsDir, file);
    const partialName = path.basename(file, '.hbs');
    const template = fs.readFileSync(filePath, 'utf8');
    Handlebars.registerPartial(partialName, template);
  });
}