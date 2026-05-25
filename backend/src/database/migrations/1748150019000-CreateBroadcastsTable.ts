import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBroadcastsTable1748150019000 implements MigrationInterface {
  name = 'CreateBroadcastsTable1748150019000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "broadcasts" (
        "id"          uuid        NOT NULL DEFAULT uuid_generate_v4(),
        "title"       varchar     NOT NULL,
        "body"        text        NOT NULL,
        "target_role" "public"."users_role_enum",
        "sent_by"     uuid,
        "sent_at"     timestamptz,
        CONSTRAINT "PK_broadcasts" PRIMARY KEY ("id"),
        CONSTRAINT "FK_broadcasts_sent_by"
          FOREIGN KEY ("sent_by") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "broadcasts"`);
  }
}
