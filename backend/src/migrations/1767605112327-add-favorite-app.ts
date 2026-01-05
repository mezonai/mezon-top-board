import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFavoriteApp1767605112327 implements MigrationInterface {
    name = 'AddFavoriteApp1767605112327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "favorite_apps" ("userId" uuid NOT NULL, "appId" uuid NOT NULL, CONSTRAINT "PK_975dc4cc689148f7443d3ab5472" PRIMARY KEY ("userId", "appId"))`);
        await queryRunner.query(`ALTER TABLE "favorite_apps" ADD CONSTRAINT "FK_6cd68a3246b99dba6f701d76811" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite_apps" ADD CONSTRAINT "FK_11c1bc85b996d126082ea95536f" FOREIGN KEY ("appId") REFERENCES "app"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorite_apps" DROP CONSTRAINT "FK_11c1bc85b996d126082ea95536f"`);
        await queryRunner.query(`ALTER TABLE "favorite_apps" DROP CONSTRAINT "FK_6cd68a3246b99dba6f701d76811"`);
        await queryRunner.query(`DROP TABLE "favorite_apps"`);
    }

}
