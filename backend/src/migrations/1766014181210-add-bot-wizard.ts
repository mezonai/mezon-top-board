import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBotWizard1766014181210 implements MigrationInterface {
    name = 'AddBotWizard1766014181210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."bot_wizard_status_enum" AS ENUM('PROCESSING', 'COMPLETED', 'EXPIRED')`);
        await queryRunner.query(`CREATE TABLE "bot_wizard" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "botName" character varying NOT NULL, "status" "public"."bot_wizard_status_enum", "templateJson" text, "ownerId" uuid, "tempFileId" uuid, CONSTRAINT "UQ_844e05774d45ceccd88b1cd9130" UNIQUE ("tempFileId"), CONSTRAINT "REL_844e05774d45ceccd88b1cd913" UNIQUE ("tempFileId"), CONSTRAINT "PK_c55615d620f764662207d0724d2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "bot_wizard" ADD CONSTRAINT "FK_2f3bcd4fc39dded5b9fcac6b2c2" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bot_wizard" ADD CONSTRAINT "FK_844e05774d45ceccd88b1cd9130" FOREIGN KEY ("tempFileId") REFERENCES "temp_file"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bot_wizard" DROP CONSTRAINT "FK_844e05774d45ceccd88b1cd9130"`);
        await queryRunner.query(`ALTER TABLE "bot_wizard" DROP CONSTRAINT "FK_2f3bcd4fc39dded5b9fcac6b2c2"`);
        await queryRunner.query(`DROP TABLE "bot_wizard"`);
        await queryRunner.query(`DROP TYPE "public"."bot_wizard_status_enum"`);
    }

}
