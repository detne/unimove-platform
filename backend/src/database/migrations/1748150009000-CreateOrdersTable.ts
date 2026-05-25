import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrdersTable1748150009000 implements MigrationInterface {
  name = 'CreateOrdersTable1748150009000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."orders_status_enum" AS ENUM('pending', 'accepted', 'provider_arriving', 'in_progress', 'completed', 'cancelled', 'disputed')`,
    );
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "order_code" varchar NOT NULL,
        "customer_id" uuid NOT NULL,
        "provider_id" uuid,
        "service_package_id" uuid,
        "pickup_address" text NOT NULL,
        "pickup_lat" double precision NOT NULL,
        "pickup_lng" double precision NOT NULL,
        "dropoff_address" text NOT NULL,
        "dropoff_lat" double precision NOT NULL,
        "dropoff_lng" double precision NOT NULL,
        "distance_km" decimal(8,2),
        "scheduled_at" timestamptz NOT NULL,
        "accepted_at" timestamptz,
        "started_at" timestamptz,
        "completed_at" timestamptz,
        "cancelled_at" timestamptz,
        "cancel_reason" text,
        "cancelled_by" uuid,
        "base_amount" decimal(12,2) NOT NULL,
        "extra_fee" decimal(12,2),
        "total_amount" decimal(12,2) NOT NULL,
        "deposit_amount" decimal(12,2),
        "platform_fee" decimal(12,2),
        "provider_earnings" decimal(12,2),
        "customer_note" text,
        "status" "public"."orders_status_enum" NOT NULL DEFAULT 'pending',
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_orders_order_code" UNIQUE ("order_code"),
        CONSTRAINT "PK_orders" PRIMARY KEY ("id"),
        CONSTRAINT "FK_orders_customer_id" FOREIGN KEY ("customer_id") REFERENCES "customers"("user_id"),
        CONSTRAINT "FK_orders_provider_id" FOREIGN KEY ("provider_id") REFERENCES "providers"("user_id") ON DELETE SET NULL,
        CONSTRAINT "FK_orders_service_package_id" FOREIGN KEY ("service_package_id") REFERENCES "service_packages"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_orders_cancelled_by" FOREIGN KEY ("cancelled_by") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_orders_customer_id" ON "orders" ("customer_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_orders_provider_id" ON "orders" ("provider_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_orders_status" ON "orders" ("status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_orders_status"`);
    await queryRunner.query(`DROP INDEX "IDX_orders_provider_id"`);
    await queryRunner.query(`DROP INDEX "IDX_orders_customer_id"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
  }
}
