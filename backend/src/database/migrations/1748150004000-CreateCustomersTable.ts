import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomersTable1748150004000 implements MigrationInterface {
  name = 'CreateCustomersTable1748150004000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "customers" (
        "user_id" uuid NOT NULL,
        "default_address" text,
        "default_lat" double precision,
        "default_lng" double precision,
        "total_orders" integer NOT NULL DEFAULT 0,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_customers" PRIMARY KEY ("user_id"),
        CONSTRAINT "FK_customers_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "customers"`);
  }
}
