import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateServiceAreasTable1748150008000 implements MigrationInterface {
  name = 'CreateServiceAreasTable1748150008000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "service_areas" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "provider_id" uuid NOT NULL,
        "city" varchar NOT NULL,
        "district" varchar,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_service_areas" PRIMARY KEY ("id"),
        CONSTRAINT "FK_service_areas_provider_id" FOREIGN KEY ("provider_id") REFERENCES "providers"("user_id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_service_areas_provider_id" ON "service_areas" ("provider_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_service_areas_provider_id"`);
    await queryRunner.query(`DROP TABLE "service_areas"`);
  }
}
