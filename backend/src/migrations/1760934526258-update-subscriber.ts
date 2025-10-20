import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSubscriber1760934526258 implements MigrationInterface {
    name = 'UpdateSubscriber1760934526258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subscribe" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "email" character varying NOT NULL, "status" "public"."subscribe_status_enum" NOT NULL DEFAULT 'PENDING', "confirmationToken" character varying, "confirmationTokenExpires" TIMESTAMP WITH TIME ZONE, "subscribedAt" TIMESTAMP WITH TIME ZONE, "unsubscribedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_ccd17da54ad3367a752be476971" UNIQUE ("email"), CONSTRAINT "PK_3e91e772184cd3feb30688ef1b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "mail_subscribers" ADD CONSTRAINT "FK_6c7175ca1ae1a65e51f0d59e620" FOREIGN KEY ("subscriber_id") REFERENCES "subscribe"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mail_subscribers" DROP CONSTRAINT "FK_6c7175ca1ae1a65e51f0d59e620"`);
        await queryRunner.query(`DROP TABLE "subscribe"`);
    }

}
