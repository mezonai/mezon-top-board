import { MigrationInterface, QueryRunner } from "typeorm";

export class DropCollectionAppTable1779079856845 implements MigrationInterface {
    name = 'DropCollectionAppTable1779079856845'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_translation" DROP CONSTRAINT "FK_app_translation_appId"`);
        await queryRunner.query(`ALTER TABLE "app_translation" DROP CONSTRAINT "FK_app_translation_appVersionId"`);
        await queryRunner.query(`CREATE TABLE "collection_apps_app" ("collectionId" uuid NOT NULL, "appId" uuid NOT NULL, CONSTRAINT "PK_cfc6730f8f40c41bbffba2e9327" PRIMARY KEY ("collectionId", "appId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8ec400b03ee55e6d60ba5bf32a" ON "collection_apps_app" ("collectionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_de6e8491d94f53473902e177ee" ON "collection_apps_app" ("appId") `);
        await queryRunner.query(`ALTER TABLE "app_translation" ADD CONSTRAINT "FK_629a1c43aeb608f13d0d7bc1eb0" FOREIGN KEY ("appId") REFERENCES "app"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "app_translation" ADD CONSTRAINT "FK_3aa50a84a666d0ce38aeceb1c64" FOREIGN KEY ("appVersionId") REFERENCES "app_version"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "collection_apps_app" ADD CONSTRAINT "FK_8ec400b03ee55e6d60ba5bf32a1" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "collection_apps_app" ADD CONSTRAINT "FK_de6e8491d94f53473902e177ee6" FOREIGN KEY ("appId") REFERENCES "app"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "collection_apps_app" DROP CONSTRAINT "FK_de6e8491d94f53473902e177ee6"`);
        await queryRunner.query(`ALTER TABLE "collection_apps_app" DROP CONSTRAINT "FK_8ec400b03ee55e6d60ba5bf32a1"`);
        await queryRunner.query(`ALTER TABLE "app_translation" DROP CONSTRAINT "FK_3aa50a84a666d0ce38aeceb1c64"`);
        await queryRunner.query(`ALTER TABLE "app_translation" DROP CONSTRAINT "FK_629a1c43aeb608f13d0d7bc1eb0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_de6e8491d94f53473902e177ee"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8ec400b03ee55e6d60ba5bf32a"`);
        await queryRunner.query(`DROP TABLE "collection_apps_app"`);
        await queryRunner.query(`ALTER TABLE "app_translation" ADD CONSTRAINT "FK_app_translation_appVersionId" FOREIGN KEY ("appVersionId") REFERENCES "app_version"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "app_translation" ADD CONSTRAINT "FK_app_translation_appId" FOREIGN KEY ("appId") REFERENCES "app"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
