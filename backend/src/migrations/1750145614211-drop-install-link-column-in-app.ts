import { MigrationInterface, QueryRunner } from "typeorm";

export class DropInstallLinkColumnInApp1750145614211 implements MigrationInterface {
    name = 'DropInstallLinkColumnInApp1750145614211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app" DROP COLUMN "installLink"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app" ADD "installLink" character varying`);
    }

}
