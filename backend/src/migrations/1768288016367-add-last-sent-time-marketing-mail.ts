import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLastSentTimeMarketingMail1768288016367 implements MigrationInterface {
    name = 'AddLastSentTimeMarketingMail1768288016367'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mail_template" ADD "lastSentAt" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mail_template" DROP COLUMN "lastSentAt"`);
    }

}
