import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNotificationsTable1748150018000 implements MigrationInterface {
  name = 'CreateNotificationsTable1748150018000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."notifications_type_enum" AS ENUM('order','chat','payment','system','promotion')
    `);

    await queryRunner.query(`
      CREATE TABLE "notifications" (
        "id"         uuid        NOT NULL DEFAULT uuid_generate_v4(),
        "user_id"    uuid        NOT NULL,
        "type"       "public"."notifications_type_enum" NOT NULL,
        "title"      varchar     NOT NULL,
        "body"       text,
        "data"       jsonb,
        "is_read"    boolean     NOT NULL DEFAULT false,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_notifications" PRIMARY KEY ("id"),
        CONSTRAINT "FK_notifications_user_id"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_notifications_user_id" ON "notifications" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_notifications_is_read" ON "notifications" ("user_id", "is_read")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_notifications_is_read"`);
    await queryRunner.query(`DROP INDEX "IDX_notifications_user_id"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
  }
}
