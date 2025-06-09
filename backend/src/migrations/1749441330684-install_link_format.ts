import { MigrationInterface, QueryRunner } from "typeorm";

export class InstallLinkFormat1749441330684 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const apps = await queryRunner.query(
      `SELECT id, "installLink" FROM app WHERE "installLink" IS NOT NULL`,
    );

    for (const app of apps) {
      const { id, installLink } = app;

      let type = "bot";
      if (installLink.includes("/app/")) {
        type = "app";
      }

      const match = installLink.match(/\/install\/([^/?#]+)/);
      const toolId = match?.[1];

      if (!toolId) continue;

      const newLink = `https://mezon.ai/developers/${type}/install/${toolId}`;

      await queryRunner.query(
        `UPDATE app SET "installLink" = $1 WHERE id = $2`,
        [newLink, id],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
