import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColorToTag1768204600000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "tag",
            new TableColumn({
                name: "color",
                type: "varchar",
                isNullable: true,
                default: "'#4b5563'"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("tag", "color");
    }
}
