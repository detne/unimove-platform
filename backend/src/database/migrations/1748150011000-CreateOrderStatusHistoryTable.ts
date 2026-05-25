import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderStatusHistoryTable1748150011000 implements MigrationInterface {
  name = 'CreateOrderStatusHistoryTable1748150011000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "order_status_history" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "order_id" uuid NOT NULL,
        "status" "public"."orders_status_enum" NOT NULL,
        "changed_by" uuid,
        "note" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_order_status_history" PRIMARY KEY ("id"),
        CONSTRAINT "FK_order_status_history_order_id" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_order_status_history_changed_by" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_order_status_history_order_id" ON "order_status_history" ("order_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_order_status_history_order_id"`);
    await queryRunner.query(`DROP TABLE "order_status_history"`);
  }
}
