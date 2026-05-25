import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1748150001000 implements MigrationInterface {
  name = 'CreateUsersTable1748150001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('customer', 'provider', 'admin')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'banned', 'pending')`,
    );
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" varchar NOT NULL,
        "phone" varchar,
        "password_hash" varchar NOT NULL,
        "full_name" varchar NOT NULL,
        "avatar_url" text,
        "role" "public"."users_role_enum" NOT NULL,
        "status" "public"."users_status_enum" NOT NULL DEFAULT 'pending',
        "google_id" varchar,
        "email_verified" boolean NOT NULL DEFAULT false,
        "last_login_at" timestamptz,
        "reset_password_token" varchar,
        "reset_password_expires_at" timestamptz,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "UQ_users_phone" UNIQUE ("phone"),
        CONSTRAINT "UQ_users_google_id" UNIQUE ("google_id"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
