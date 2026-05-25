import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReviewsTable1748150016000 implements MigrationInterface {
  name = 'CreateReviewsTable1748150016000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "reviews" (
        "id"          uuid        NOT NULL DEFAULT uuid_generate_v4(),
        "order_id"    uuid        NOT NULL,
        "customer_id" uuid        NOT NULL,
        "provider_id" uuid        NOT NULL,
        "rating"      smallint    NOT NULL,
        "comment"     text,
        "is_hidden"   boolean     NOT NULL DEFAULT false,
        "created_at"  timestamptz NOT NULL DEFAULT now(),
        "updated_at"  timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_reviews_order_id"   UNIQUE ("order_id"),
        CONSTRAINT "CHK_reviews_rating"    CHECK (rating >= 1 AND rating <= 5),
        CONSTRAINT "PK_reviews"            PRIMARY KEY ("id"),
        CONSTRAINT "FK_reviews_order_id"
          FOREIGN KEY ("order_id") REFERENCES "orders"("id"),
        CONSTRAINT "FK_reviews_customer_id"
          FOREIGN KEY ("customer_id") REFERENCES "customers"("user_id"),
        CONSTRAINT "FK_reviews_provider_id"
          FOREIGN KEY ("provider_id") REFERENCES "providers"("user_id")
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_reviews_provider_id" ON "reviews" ("provider_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_reviews_provider_id"`);
    await queryRunner.query(`DROP TABLE "reviews"`);
  }
}
