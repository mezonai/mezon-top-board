import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeactiveUser1763535167579 implements MigrationInterface {
    name = 'AddDeactiveUser1763535167579'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "deactive" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deactive"`);
    }

}
