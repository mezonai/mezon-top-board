import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPricingColumn1760514219445 implements MigrationInterface {
  name = "AddPricingColumn1760514219445";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."app_pricingtag_enum" AS ENUM('FREE', 'PAID')`,
    );
    await queryRunner.query(
      `ALTER TABLE "app" ADD "pricingTag" "public"."app_pricingtag_enum" NOT NULL DEFAULT 'FREE'`,
    );
    await queryRunner.query(`ALTER TABLE "app" ADD "price" numeric(15,0)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "app" DROP COLUMN "price"`);
    await queryRunner.query(`ALTER TABLE "app" DROP COLUMN "pricingTag"`);
    await queryRunner.query(`DROP TYPE "public"."app_pricingtag_enum"`);
  }
}
