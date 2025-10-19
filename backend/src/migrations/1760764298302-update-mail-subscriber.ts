import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMailSubscriber1760764298302 implements MigrationInterface {
    name = 'UpdateMailSubscriber1760764298302'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mail_subscribers" ("mail_id" uuid NOT NULL, "subscriber_id" uuid NOT NULL, CONSTRAINT "PK_5a9f1c41e9f5c1a84c2b48db197" PRIMARY KEY ("mail_id", "subscriber_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2059a5c0650fc3cdd09ac8ba0c" ON "mail_subscribers" ("mail_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_6c7175ca1ae1a65e51f0d59e62" ON "mail_subscribers" ("subscriber_id") `);
        await queryRunner.query(`ALTER TABLE "mail_subscribers" ADD CONSTRAINT "FK_2059a5c0650fc3cdd09ac8ba0ce" FOREIGN KEY ("mail_id") REFERENCES "mail"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "mail_subscribers" ADD CONSTRAINT "FK_6c7175ca1ae1a65e51f0d59e620" FOREIGN KEY ("subscriber_id") REFERENCES "subscribe"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mail_subscribers" DROP CONSTRAINT "FK_6c7175ca1ae1a65e51f0d59e620"`);
        await queryRunner.query(`ALTER TABLE "mail_subscribers" DROP CONSTRAINT "FK_2059a5c0650fc3cdd09ac8ba0ce"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6c7175ca1ae1a65e51f0d59e62"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2059a5c0650fc3cdd09ac8ba0c"`);
        await queryRunner.query(`DROP TABLE "mail_subscribers"`);
    }

}
