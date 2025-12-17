import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBotWizard1765879490091 implements MigrationInterface {
    name = 'AddBotWizard1765879490091'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."bot_wizard_status_enum" AS ENUM('PROCESSING', 'COMPLETED', 'EXPIRED')`);
        await queryRunner.query(`CREATE TABLE "bot_wizard" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "botName" character varying NOT NULL, "status" "public"."bot_wizard_status_enum", "templateJson" jsonb, "ownerId" uuid, CONSTRAINT "PK_c55615d620f764662207d0724d2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "temp_file" ADD "botWizardId" uuid`);
        await queryRunner.query(`ALTER TABLE "temp_file" ADD CONSTRAINT "UQ_aba462fb030e110c5e57dd49d8a" UNIQUE ("botWizardId")`);
        await queryRunner.query(`ALTER TABLE "bot_wizard" ADD CONSTRAINT "FK_2f3bcd4fc39dded5b9fcac6b2c2" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "temp_file" ADD CONSTRAINT "FK_aba462fb030e110c5e57dd49d8a" FOREIGN KEY ("botWizardId") REFERENCES "bot_wizard"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "temp_file" DROP CONSTRAINT "FK_aba462fb030e110c5e57dd49d8a"`);
        await queryRunner.query(`ALTER TABLE "bot_wizard" DROP CONSTRAINT "FK_2f3bcd4fc39dded5b9fcac6b2c2"`);
        await queryRunner.query(`ALTER TABLE "temp_file" DROP CONSTRAINT "UQ_aba462fb030e110c5e57dd49d8a"`);
        await queryRunner.query(`ALTER TABLE "temp_file" DROP COLUMN "botWizardId"`);
        await queryRunner.query(`DROP TABLE "bot_wizard"`);
        await queryRunner.query(`DROP TYPE "public"."bot_wizard_status_enum"`);
    }

}
