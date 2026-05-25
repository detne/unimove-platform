import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateServicePackagesTable1748150007000 implements MigrationInterface {
  name = 'CreateServicePackagesTable1748150007000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "service_packages" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "provider_id" uuid NOT NULL,
        "name" varchar NOT NULL,
        "description" text,
        "base_price" decimal(12,2) NOT NULL,
        "price_per_km" decimal(8,2),
        "min_distance_km" decimal(8,2),
        "max_distance_km" decimal(8,2),
        "helper_included" boolean NOT NULL DEFAULT false,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_service_packages" PRIMARY KEY ("id"),
        CONSTRAINT "FK_service_packages_provider_id" FOREIGN KEY ("provider_id") REFERENCES "providers"("user_id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_service_packages_provider_id" ON "service_packages" ("provider_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_service_packages_provider_id"`);
    await queryRunner.query(`DROP TABLE "service_packages"`);
  }
}
