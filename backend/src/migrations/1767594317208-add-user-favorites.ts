import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserFavorites1767594317208 implements MigrationInterface {
    name = 'AddUserFavorites1767594317208'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_favorites" ("userId" uuid NOT NULL, "appId" uuid NOT NULL, CONSTRAINT "PK_6d935ac57e44c8f4d1a1c0f43f9" PRIMARY KEY ("userId", "appId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1dd5c393ad0517be3c31a7af83" ON "user_favorites" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e23fa16cd60a687b773bc0f522" ON "user_favorites" ("appId") `);
        await queryRunner.query(`ALTER TABLE "user_favorites" ADD CONSTRAINT "FK_1dd5c393ad0517be3c31a7af836" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_favorites" ADD CONSTRAINT "FK_e23fa16cd60a687b773bc0f5221" FOREIGN KEY ("appId") REFERENCES "app"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_favorites" DROP CONSTRAINT "FK_e23fa16cd60a687b773bc0f5221"`);
        await queryRunner.query(`ALTER TABLE "user_favorites" DROP CONSTRAINT "FK_1dd5c393ad0517be3c31a7af836"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e23fa16cd60a687b773bc0f522"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1dd5c393ad0517be3c31a7af83"`);
        await queryRunner.query(`DROP TABLE "user_favorites"`);
    }

}
