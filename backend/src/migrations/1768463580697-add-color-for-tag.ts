import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColorForTag1768463580697 implements MigrationInterface {
    name = 'AddColorForTag1768463580697'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" ADD "color" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "color"`);
    }

}
