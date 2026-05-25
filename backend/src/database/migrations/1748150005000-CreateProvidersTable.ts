import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProvidersTable1748150005000 implements MigrationInterface {
  name = 'CreateProvidersTable1748150005000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."providers_verify_status_enum" AS ENUM('pending', 'approved', 'rejected', 'resubmit')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."providers_vehicle_type_enum" AS ENUM('motorbike', 'van_500kg', 'van_1000kg', 'truck_1500kg', 'truck_2500kg')`,
    );
    await queryRunner.query(`
      CREATE TABLE "providers" (
        "user_id" uuid NOT NULL,
        "verify_status" "public"."providers_verify_status_enum" DEFAULT 'pending',
        "verified_at" timestamptz,
        "verified_by" uuid,
        "reject_reason" text,
        "vehicle_type" "public"."providers_vehicle_type_enum" NOT NULL,
        "vehicle_plate" varchar NOT NULL,
        "vehicle_brand" varchar,
        "vehicle_model" varchar,
        "vehicle_year" integer,
        "vehicle_capacity_kg" integer,
        "bio" text,
        "rating_avg" decimal(3,2),
        "rating_count" integer NOT NULL DEFAULT 0,
        "total_orders" integer NOT NULL DEFAULT 0,
        "total_earnings" decimal(12,2) NOT NULL DEFAULT 0,
        "is_online" boolean NOT NULL DEFAULT false,
        "current_lat" double precision,
        "current_lng" double precision,
        "last_active_at" timestamptz,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_providers_vehicle_plate" UNIQUE ("vehicle_plate"),
        CONSTRAINT "PK_providers" PRIMARY KEY ("user_id"),
        CONSTRAINT "FK_providers_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_providers_verified_by" FOREIGN KEY ("verified_by") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "providers"`);
    await queryRunner.query(`DROP TYPE "public"."providers_vehicle_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."providers_verify_status_enum"`);
  }
}
