import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSubscribeMailEntities1760688474456 implements MigrationInterface {
    name = 'UpdateSubscribeMailEntities1760688474456'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying NOT NULL, "subject" character varying NOT NULL, "content" text NOT NULL, CONSTRAINT "PK_5407da42b983ba54c6c62d462d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscribe" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "email" character varying NOT NULL, "status" "public"."subscribe_status_enum" NOT NULL DEFAULT 'PENDING', "confirmationToken" character varying, "confirmationTokenExpires" TIMESTAMP WITH TIME ZONE, "subscribedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "repeatEvery" integer, "repeatUnit" "public"."subscribe_repeatunit_enum" NOT NULL DEFAULT 'DAY', "isRepeatable" boolean NOT NULL DEFAULT false, "sendTime" TIME, "lastSentAt" TIMESTAMP WITH TIME ZONE, "unsubscribedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_ccd17da54ad3367a752be476971" UNIQUE ("email"), CONSTRAINT "PK_3e91e772184cd3feb30688ef1b8" PRIMARY KEY ("id"))`);
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
        await queryRunner.query(`DROP TABLE "subscribe"`);
        await queryRunner.query(`DROP TABLE "mail"`);
    }

}
