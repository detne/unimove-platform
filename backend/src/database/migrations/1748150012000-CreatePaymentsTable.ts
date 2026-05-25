import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentsTable1748150012000 implements MigrationInterface {
  name = 'CreatePaymentsTable1748150012000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."payments_type_enum" AS ENUM('deposit', 'final', 'refund')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payments_status_enum" AS ENUM('pending', 'paid', 'failed', 'refunded')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payments_method_enum" AS ENUM('payos', 'qr', 'cash')`,
    );
    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "order_id" uuid NOT NULL,
        "payment_type" "public"."payments_type_enum" NOT NULL,
        "method" "public"."payments_method_enum" NOT NULL,
        "amount" decimal(12,2) NOT NULL,
        "status" "public"."payments_status_enum" NOT NULL DEFAULT 'pending',
        "payos_order_code" bigint,
        "payos_payment_id" varchar,
        "payos_checkout_url" text,
        "payos_qr_code" text,
        "paid_at" timestamptz,
        "failure_reason" text,
        "refunded_amount" decimal(12,2),
        "refund_reason" text,
        "refunded_by" uuid,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_payments_payos_order_code" UNIQUE ("payos_order_code"),
        CONSTRAINT "PK_payments" PRIMARY KEY ("id"),
        CONSTRAINT "FK_payments_order_id" FOREIGN KEY ("order_id") REFERENCES "orders"("id"),
        CONSTRAINT "FK_payments_refunded_by" FOREIGN KEY ("refunded_by") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_payments_order_id" ON "payments" ("order_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_payments_order_id"`);
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TYPE "public"."payments_method_enum"`);
    await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."payments_type_enum"`);
  }
}
