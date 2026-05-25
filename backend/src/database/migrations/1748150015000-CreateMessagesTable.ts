import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMessagesTable1748150015000 implements MigrationInterface {
  name = 'CreateMessagesTable1748150015000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "messages" (
        "id"              uuid        NOT NULL DEFAULT uuid_generate_v4(),
        "conversation_id" uuid        NOT NULL,
        "sender_id"       uuid        NOT NULL,
        "content"         text,
        "image_url"       text,
        "is_read"         boolean     NOT NULL DEFAULT false,
        "created_at"      timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_messages" PRIMARY KEY ("id"),
        CONSTRAINT "FK_messages_conversation_id"
          FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_messages_sender_id"
          FOREIGN KEY ("sender_id") REFERENCES "users"("id")
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_messages_conversation_id" ON "messages" ("conversation_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_messages_sender_id" ON "messages" ("sender_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_messages_sender_id"`);
    await queryRunner.query(`DROP INDEX "IDX_messages_conversation_id"`);
    await queryRunner.query(`DROP TABLE "messages"`);
  }
}
