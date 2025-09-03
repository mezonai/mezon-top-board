import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableCampaign1756463378288 implements MigrationInterface {
    name = 'CreateTableCampaign1756463378288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "newsletter_campaign" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying(255) NOT NULL, "headline" character varying(255), "description" text, CONSTRAINT "PK_2b40b934cee2f5e3fb2184681d6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscribers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "email" character varying NOT NULL, "confirmToken" character varying(64), "isConfirmed" boolean NOT NULL DEFAULT false, "subscribedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1a7163c08f0e57bd1c9821508b1" UNIQUE ("email"), CONSTRAINT "PK_cbe0a7a9256c826f403c0236b67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "newsletter_schedule" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "mode" character varying NOT NULL, "fixedHours" integer array, "intervalValue" integer, "intervalUnit" character varying, CONSTRAINT "PK_aa960bc16e9cd19b75ca3220a09" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "campaign_delivery" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "delivered" boolean NOT NULL DEFAULT false, "deliveredAt" TIMESTAMP, "campaignId" uuid, "subscriberId" uuid, CONSTRAINT "PK_a4aad67d661120ea63709181095" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "campaign_delivery" ADD CONSTRAINT "FK_6a88d51800d2187e8e1674bc278" FOREIGN KEY ("campaignId") REFERENCES "newsletter_campaign"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaign_delivery" ADD CONSTRAINT "FK_774125c0c5f401e8eff40e05a51" FOREIGN KEY ("subscriberId") REFERENCES "subscribers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaign_delivery" DROP CONSTRAINT "FK_774125c0c5f401e8eff40e05a51"`);
        await queryRunner.query(`ALTER TABLE "campaign_delivery" DROP CONSTRAINT "FK_6a88d51800d2187e8e1674bc278"`);
        await queryRunner.query(`DROP TABLE "campaign_delivery"`);
        await queryRunner.query(`DROP TABLE "newsletter_schedule"`);
        await queryRunner.query(`DROP TABLE "subscribers"`);
        await queryRunner.query(`DROP TABLE "newsletter_campaign"`);
    }

}
