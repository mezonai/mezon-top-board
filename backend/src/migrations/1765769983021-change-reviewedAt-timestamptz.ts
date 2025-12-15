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
        await queryRunner.query(`
            DO $$
            DECLARE
                r RECORD;
            BEGIN
                FOR r IN
                SELECT table_name, column_name
                FROM information_schema.columns
                WHERE column_name IN ('createdAt', 'updatedAt', 'deletedAt')
                    AND data_type = 'timestamp without time zone'
                    AND table_schema = 'public'
                LOOP
                EXECUTE format(
                    'ALTER TABLE %I
                    ALTER COLUMN %I
                    TYPE timestamptz
                    USING %I AT TIME ZONE ''Asia/Ho_Chi_Minh'';',
                    r.table_name,
                    r.column_name,
                    r.column_name
                );
                END LOOP;
            END $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DO $$
            DECLARE
                r RECORD;
            BEGIN
                FOR r IN
                SELECT table_name, column_name
                FROM information_schema.columns
                WHERE column_name IN ('createdAt', 'updatedAt', 'deletedAt')
                    AND data_type = 'timestamp with time zone'
                    AND table_schema = 'public'
                LOOP
                EXECUTE format(
                    'ALTER TABLE %I
                    ALTER COLUMN %I
                    TYPE timestamp
                    USING %I::timestamp;',
                    r.table_name,
                    r.column_name,
                    r.column_name
                );
                END LOOP;
            END $$;
        `);
        await queryRunner.query(`
            ALTER TABLE "app_review_history"
            ALTER COLUMN "reviewedAt"
            TYPE TIMESTAMP
            USING "reviewedAt";
        `);
    }
}
