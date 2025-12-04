import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTempSourceFileEntity1764659847423 implements MigrationInterface {
    name = 'AddTempSourceFileEntity1764659847423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."temp_source_file_status_enum" AS ENUM('PROCESSING', 'COMPLETED', 'EXPIRED')`);
        await queryRunner.query(`CREATE TABLE "temp_source_file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "fileName" character varying NOT NULL, "filePath" character varying, "status" "public"."temp_source_file_status_enum" NOT NULL DEFAULT 'PROCESSING', "completedAt" TIMESTAMPTZ, "ownerId" uuid, CONSTRAINT "PK_3f9d0ed219f2fb08e69970db7ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "temp_source_file" ADD CONSTRAINT "FK_597678e34de6db6fb2e48a3e01a" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "temp_source_file" DROP CONSTRAINT "FK_597678e34de6db6fb2e48a3e01a"`);
        await queryRunner.query(`DROP TABLE "temp_source_file"`);
        await queryRunner.query(`DROP TYPE "public"."temp_source_file_status_enum"`);
    }

}
