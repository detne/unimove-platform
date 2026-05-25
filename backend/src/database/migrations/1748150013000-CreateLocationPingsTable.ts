import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLocationPingsTable1748150013000 implements MigrationInterface {
  name = 'CreateLocationPingsTable1748150013000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "location_pings" (
        "id"          bigserial        NOT NULL,
        "order_id"    uuid             NOT NULL,
        "provider_id" uuid             NOT NULL,
        "lat"         double precision NOT NULL,
        "lng"         double precision NOT NULL,
        "speed_kmh"   real,
        "heading"     real,
        "recorded_at" timestamptz      NOT NULL DEFAULT now(),
        CONSTRAINT "PK_location_pings" PRIMARY KEY ("id"),
        CONSTRAINT "FK_location_pings_order_id"
          FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_location_pings_provider_id"
          FOREIGN KEY ("provider_id") REFERENCES "providers"("user_id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_location_pings_order_id" ON "location_pings" ("order_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_location_pings_provider_id" ON "location_pings" ("provider_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_location_pings_recorded_at" ON "location_pings" ("recorded_at")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_location_pings_recorded_at"`);
    await queryRunner.query(`DROP INDEX "IDX_location_pings_provider_id"`);
    await queryRunner.query(`DROP INDEX "IDX_location_pings_order_id"`);
    await queryRunner.query(`DROP TABLE "location_pings"`);
  }
}
