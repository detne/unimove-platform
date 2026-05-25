import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBannersTable1748150020000 implements MigrationInterface {
  name = 'CreateBannersTable1748150020000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "banners" (
        "id"         uuid        NOT NULL DEFAULT uuid_generate_v4(),
        "title"      varchar,
        "image_url"  text        NOT NULL,
        "link_url"   text,
        "position"   integer,
        "is_active"  boolean     NOT NULL DEFAULT true,
        "start_at"   timestamptz,
        "end_at"     timestamptz,
        "created_by" uuid,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_banners" PRIMARY KEY ("id"),
        CONSTRAINT "FK_banners_created_by"
          FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_banners_is_active" ON "banners" ("is_active")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_banners_is_active"`);
    await queryRunner.query(`DROP TABLE "banners"`);
  }
}
