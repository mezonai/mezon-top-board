import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveInstallLinkFromApp1749720737420 implements MigrationInterface {
name = 'RemoveInstallLinkFromApp1749718494966';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasInstallLink = await queryRunner.hasColumn("app", "installLink");
    if (hasInstallLink) {
      await queryRunner.query(`
        ALTER TABLE "app"
        DROP COLUMN "installLink"
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "app"
      ADD COLUMN "installLink" character varying
    `);

    const apps = await queryRunner.query(`
      SELECT id, "mezonAppId", "type"
      FROM app
      WHERE "mezonAppId" IS NOT NULL
    `);

    for (const app of apps) {
      const { id, mezonAppId, type } = app;
      const installLink = `https://mezon.ai/developers/${type}/install/${mezonAppId}`;

      await queryRunner.query(
        `UPDATE app SET "installLink" = $1 WHERE id = $2`,
        [installLink, id],
      );
    }
  }
}
