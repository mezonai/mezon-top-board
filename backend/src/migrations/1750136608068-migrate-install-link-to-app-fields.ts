import { MigrationInterface, QueryRunner } from "typeorm";

import { MezonAppType } from "@domain/common/enum/mezonAppType";

export class MigrateInstallLinkToAppFields1750136608068 implements MigrationInterface {
  name = "MigrateInstallLinkToAppFields1750136608068";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const apps = await queryRunner.query(
      `SELECT id, "installLink" FROM app WHERE "installLink" IS NOT NULL`,
    );

    for (const app of apps) {
      const { id, installLink } = app;

      let type: MezonAppType = MezonAppType.BOT;
      let mezonAppId: string | null = null;

      if (installLink.includes("/app/install")) {
        type = MezonAppType.APP;
      }

      const match = installLink.match(/\/install\/([^/?#]+)/);
      mezonAppId = match ? match[1] : null;

      await queryRunner.query(
        `UPDATE app SET "mezonAppId" = $1, "type" = $2 WHERE id = $3`,
        [mezonAppId, type, id],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE app SET "mezonAppId" = NULL, "type" = 'bot'`,
    );
  }
}
