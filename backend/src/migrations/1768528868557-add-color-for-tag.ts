import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColorForTag1768528868557 implements MigrationInterface {
    name = 'AddColorForTag1768528868557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" ADD "color" character varying NOT NULL DEFAULT 'magenta'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "color"`);
    }

}
