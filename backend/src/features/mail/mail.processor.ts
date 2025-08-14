
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('email')
export class MailProcessor {
  constructor(private mailerService: MailerService) {}

  @Process('sendConfirmEmail')
  async handleConfirmationEmail(job: Job) {
    const { to, subject, template, context } = job.data;
    console.log('📨 Processing job sendConfirmEmail for:', job.data.to);
    console.log('Processing email job:', job.id, 'to:', to, 'subject:', subject);
    try {
      await this.mailerService.sendMail({
        to: to,
        subject: subject,
        template: template,
        context: context,
      });
    } catch (err) {
      console.error('Failed to send email:', err);
    }
  }
}
