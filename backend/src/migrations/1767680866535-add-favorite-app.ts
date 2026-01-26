import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFavoriteApp1767680866535 implements MigrationInterface {
    name = 'AddFavoriteApp1767680866535'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "favorite_app" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "userId" uuid NOT NULL, "appId" uuid NOT NULL, CONSTRAINT "UQ_928f5d7e14dadf9331e67d5345a" UNIQUE ("userId", "appId"), CONSTRAINT "PK_c2f297976169465cee5ce4cea1c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "favorite_app" ADD CONSTRAINT "FK_10cb36035190402c85bda3c5f26" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite_app" ADD CONSTRAINT "FK_ec81f14dc12ce68a1aad8fb2087" FOREIGN KEY ("appId") REFERENCES "app"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorite_app" DROP CONSTRAINT "FK_ec81f14dc12ce68a1aad8fb2087"`);
        await queryRunner.query(`ALTER TABLE "favorite_app" DROP CONSTRAINT "FK_10cb36035190402c85bda3c5f26"`);
        await queryRunner.query(`DROP TABLE "favorite_app"`);
    }

}
