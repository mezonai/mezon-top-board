import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColorForTag1768462910923 implements MigrationInterface {
    name = 'AddColorForTag1768462910923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" ALTER COLUMN "color" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tag" ALTER COLUMN "color" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" ALTER COLUMN "color" SET DEFAULT '#4b5563'`);
        await queryRunner.query(`ALTER TABLE "tag" ALTER COLUMN "color" DROP NOT NULL`);
    }

}
