import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDeviceTokensTable1748150003000 implements MigrationInterface {
  name = 'CreateDeviceTokensTable1748150003000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "device_tokens" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "fcm_token" text NOT NULL,
        "platform" varchar,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_device_tokens" PRIMARY KEY ("id"),
        CONSTRAINT "FK_device_tokens_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_device_tokens_user_id" ON "device_tokens" ("user_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_device_tokens_user_id"`);
    await queryRunner.query(`DROP TABLE "device_tokens"`);
  }
}
