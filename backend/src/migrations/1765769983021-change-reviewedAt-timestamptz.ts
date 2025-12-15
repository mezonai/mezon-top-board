import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeReviewedAtTimestamptz1765769983021 implements MigrationInterface {
    name = 'ChangeReviewedAtTimestamptz1765769983021';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "app_review_history"
            ALTER COLUMN "reviewedAt"
            TYPE TIMESTAMPTZ
            USING "reviewedAt" AT TIME ZONE 'Asia/Ho_Chi_Minh';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "app_review_history"
            ALTER COLUMN "reviewedAt"
            TYPE TIMESTAMP
            USING "reviewedAt";
        `);
    }
}
