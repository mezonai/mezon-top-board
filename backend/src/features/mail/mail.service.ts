import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { buildAppUrl } from "@libs/utils/urlBuilder";

@Injectable()
export class MailService {
  constructor(@InjectQueue("email") private emailQueue: Queue) {}

  async sendGenericEmail(
    to: string,
    options: {
      subject: string;
      template: string;
      context?: Record<string, any>;
      type?: string;
    },
  ) {
    await this.emailQueue.add("sendEmail", {
      to,
      subject: options.subject,
      template: options.template,
      type: options.type ?? "generic",
      context: {
        to,
        ...options.context,
      },
    });
  }

  async sendConfirmationEmail(
    to: string,
    token: string,
    subject: string,
    template: string,
    message = "",
  ) {
    const confirmUrl = buildAppUrl("/confirm", { token });
    return this.sendGenericEmail(to, {
      subject,
      template,
      type: "confirmation",
      context: { confirmUrl, to, message },
    });
  }
}
