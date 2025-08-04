import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import envConfig from './env.config';

const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASSWORD,
  REDIS_HOST,
  REDIS_PORT,
} = envConfig();

const mailConfig = {
  transport: {
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  },
  defaults: {
    from: '"Mezon" <no-reply@mezon.ai>',
  },
  template: {
    dir: join(process.cwd(), 'src/libs/templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
const redisConfig = {
  host: REDIS_HOST,
  port: REDIS_PORT,
};

export {
  mailConfig,
  redisConfig,
};