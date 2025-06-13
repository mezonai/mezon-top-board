import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMezonAppIdAndTypeToApp1749720086542 implements MigrationInterface {
  name = 'AddMezonAppIdAndTypeToApp1749720086542';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "app"
      ADD COLUMN "mezonAppId" character varying
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_type_enum') THEN
          CREATE TYPE "app_type_enum" AS ENUM ('app', 'bot');
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      ALTER TABLE "app"
      ADD COLUMN "type" "app_type_enum" NOT NULL DEFAULT 'bot'
    `);

    const apps = await queryRunner.query(
      `SELECT id, "installLink" FROM app WHERE "installLink" IS NOT NULL`
    );

    for (const app of apps) {
      const { id, installLink } = app;
      let type = "bot";
      let mezonAppId: string | null = null;

      if (installLink.includes("/app/install")) {
        type = "app";
      }

      const match = installLink.match(/\/install\/([^/?#]+)/);
      mezonAppId = match ? match[1] : null;

      await queryRunner.query(
        `UPDATE app SET "mezonAppId" = $1, "type" = $2 WHERE id = $3`,
        [mezonAppId, type, id]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "app" DROP COLUMN "mezonAppId"`);
    await queryRunner.query(`ALTER TABLE "app" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "app_type_enum"`);
  }
}
