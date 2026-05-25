import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdminLogsTable1748150021000 implements MigrationInterface {
  name = 'CreateAdminLogsTable1748150021000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "admin_logs" (
        "id"           bigserial   NOT NULL,
        "admin_id"     uuid        NOT NULL,
        "action"       varchar     NOT NULL,
        "target_table" varchar,
        "target_id"    uuid,
        "payload"      jsonb,
        "ip_address"   varchar,
        "created_at"   timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_admin_logs" PRIMARY KEY ("id"),
        CONSTRAINT "FK_admin_logs_admin_id"
          FOREIGN KEY ("admin_id") REFERENCES "users"("id")
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_admin_logs_admin_id" ON "admin_logs" ("admin_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_admin_logs_created_at" ON "admin_logs" ("created_at")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_admin_logs_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_admin_logs_admin_id"`);
    await queryRunner.query(`DROP TABLE "admin_logs"`);
  }
}
