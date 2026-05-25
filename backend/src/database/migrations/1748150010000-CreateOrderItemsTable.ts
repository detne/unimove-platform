import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderItemsTable1748150010000 implements MigrationInterface {
  name = 'CreateOrderItemsTable1748150010000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "order_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "order_id" uuid NOT NULL,
        "item_name" varchar NOT NULL,
        "quantity" integer,
        "note" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_order_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_order_items_order_id" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "order_items"`);
  }
}
