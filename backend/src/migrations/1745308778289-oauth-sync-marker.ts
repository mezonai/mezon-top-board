import { MigrationInterface, QueryRunner } from "typeorm";

export class OauthSyncMarker1745308778289 implements MigrationInterface {
    name = 'OauthSyncMarker1745308778289'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "willSyncFromMezon" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "willSyncFromMezon"`);
    }

}
