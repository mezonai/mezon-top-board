import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTempFileEntity1764902409461 implements MigrationInterface {
    name = 'AddTempFileEntity1764902409461'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temp_file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "fileName" character varying NOT NULL, "filePath" character varying, "mimeType" character varying, "expiredAt" TIMESTAMP WITH TIME ZONE, "ownerId" uuid, CONSTRAINT "PK_4b7666c74b5ada195338547bccf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "temp_file" ADD CONSTRAINT "FK_9cf4c2aae3ebf11fcd78b356a10" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "temp_file" DROP CONSTRAINT "FK_9cf4c2aae3ebf11fcd78b356a10"`);
        await queryRunner.query(`DROP TABLE "temp_file"`);
    }

}
