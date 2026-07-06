import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCollection1776741939455 implements MigrationInterface {
    name = 'AddCollection1776741939455'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "collection_app" ("collectionId" uuid NOT NULL, "appId" uuid NOT NULL, "order" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_b43a5666b54bdb85d8a145841e7" PRIMARY KEY ("collectionId", "appId"))`);
        await queryRunner.query(`CREATE TYPE "public"."collection_status_enum" AS ENUM('PRIVATE', 'PUBLISHED')`);
        await queryRunner.query(`CREATE TABLE "collection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "title" character varying(255) NOT NULL, "description" text, "featuredImage" character varying, "status" "public"."collection_status_enum" NOT NULL DEFAULT 'PRIVATE', "ownerId" uuid NOT NULL, CONSTRAINT "PK_ad3f485bbc99d875491f44d7c85" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "collection_app" ADD CONSTRAINT "FK_b1c7116f3dabbb817dd08fbff94" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "collection_app" ADD CONSTRAINT "FK_19dc576c85c45d7f29e24713e8b" FOREIGN KEY ("appId") REFERENCES "app"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "collection" ADD CONSTRAINT "FK_71af9149c567d79c9532f7e47d0" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "collection" DROP CONSTRAINT "FK_71af9149c567d79c9532f7e47d0"`);
        await queryRunner.query(`ALTER TABLE "collection_app" DROP CONSTRAINT "FK_19dc576c85c45d7f29e24713e8b"`);
        await queryRunner.query(`ALTER TABLE "collection_app" DROP CONSTRAINT "FK_b1c7116f3dabbb817dd08fbff94"`);
        await queryRunner.query(`DROP TABLE "collection"`);
        await queryRunner.query(`DROP TYPE "public"."collection_status_enum"`);
        await queryRunner.query(`DROP TABLE "collection_app"`);
    }

}
