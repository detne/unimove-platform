import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConversationsTable1748150014000 implements MigrationInterface {
  name = 'CreateConversationsTable1748150014000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "conversations" (
        "id"              uuid        NOT NULL DEFAULT uuid_generate_v4(),
        "order_id"        uuid        NOT NULL,
        "customer_id"     uuid        NOT NULL,
        "provider_id"     uuid        NOT NULL,
        "last_message_at" timestamptz,
        "created_at"      timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_conversations_order_id" UNIQUE ("order_id"),
        CONSTRAINT "PK_conversations" PRIMARY KEY ("id"),
        CONSTRAINT "FK_conversations_order_id"
          FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_conversations_customer_id"
          FOREIGN KEY ("customer_id") REFERENCES "customers"("user_id"),
        CONSTRAINT "FK_conversations_provider_id"
          FOREIGN KEY ("provider_id") REFERENCES "providers"("user_id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "conversations"`);
  }
}
