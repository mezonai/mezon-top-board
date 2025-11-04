import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMailTemplateSubscriber1761035692201 implements MigrationInterface {
    name = 'UpdateMailTemplateSubscriber1761035692201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subscriber" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "email" character varying NOT NULL, "status" "public"."subscriber_status_enum" NOT NULL DEFAULT 'PENDING', "confirmationToken" character varying, "confirmationTokenExpires" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_073600148a22d05dcf81d119a6a" UNIQUE ("email"), CONSTRAINT "PK_1c52b7ddbaf79cd2650045b79c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."mail_template_repeatinterval_enum" AS ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'ANNUALLY')`);
        await queryRunner.query(`CREATE TABLE "mail_template" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "subject" character varying(255) NOT NULL, "content" text NOT NULL, "scheduledAt" TIMESTAMP WITH TIME ZONE, "isRepeatable" boolean NOT NULL DEFAULT false, "repeatInterval" "public"."mail_template_repeatinterval_enum" NOT NULL DEFAULT 'DAILY', CONSTRAINT "PK_e80690939ad84bbfdbc97171f43" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "mail_template"`);
        await queryRunner.query(`DROP TYPE "public"."mail_template_repeatinterval_enum"`);
        await queryRunner.query(`DROP TABLE "subscriber"`);
        await queryRunner.query(`DROP TYPE "public"."subscriber_status_enum"`);
    }

}
