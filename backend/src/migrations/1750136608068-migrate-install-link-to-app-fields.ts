import { MigrationInterface, QueryRunner } from "typeorm";

import { MezonAppType } from "@domain/common/enum/mezonAppType";
import { getMezonInstallLink } from "@libs/utils/mezonApp";

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
    // Update all apps to set installLink by getMezonInstallLink(type, mezonAppId)
    const apps = await queryRunner.query(
      `SELECT id, "mezonAppId", "type" FROM app WHERE "mezonAppId" IS NOT NULL`,
    );

    for (const app of apps) {
      const { id, mezonAppId, type } = app;

      const installLink = getMezonInstallLink(type, mezonAppId);

      await queryRunner.query(
        `UPDATE app SET "installLink" = $1 WHERE id = $2`,
        [installLink, id],
      );
    }
  }
}
