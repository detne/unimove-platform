import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDisputesTable1748150017000 implements MigrationInterface {
  name = 'CreateDisputesTable1748150017000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."disputes_status_enum" AS ENUM('open','investigating','resolved','rejected')
    `);

    await queryRunner.query(`
      CREATE TABLE "disputes" (
        "id"            uuid        NOT NULL DEFAULT uuid_generate_v4(),
        "order_id"      uuid        NOT NULL,
        "raised_by"     uuid        NOT NULL,
        "reason"        varchar     NOT NULL,
        "description"   text        NOT NULL,
        "evidence_urls" text[],
        "status"        "public"."disputes_status_enum" NOT NULL DEFAULT 'open',
        "resolution"    text,
        "resolved_by"   uuid,
        "resolved_at"   timestamptz,
        "created_at"    timestamptz NOT NULL DEFAULT now(),
        "updated_at"    timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_disputes" PRIMARY KEY ("id"),
        CONSTRAINT "FK_disputes_order_id"
          FOREIGN KEY ("order_id") REFERENCES "orders"("id"),
        CONSTRAINT "FK_disputes_raised_by"
          FOREIGN KEY ("raised_by") REFERENCES "users"("id"),
        CONSTRAINT "FK_disputes_resolved_by"
          FOREIGN KEY ("resolved_by") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_disputes_order_id" ON "disputes" ("order_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_disputes_order_id"`);
    await queryRunner.query(`DROP TABLE "disputes"`);
    await queryRunner.query(`DROP TYPE "public"."disputes_status_enum"`);
  }
}
