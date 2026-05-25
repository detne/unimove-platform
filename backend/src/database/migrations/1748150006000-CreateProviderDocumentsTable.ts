import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProviderDocumentsTable1748150006000 implements MigrationInterface {
  name = 'CreateProviderDocumentsTable1748150006000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."provider_documents_doc_type_enum" AS ENUM('cccd_front', 'cccd_back', 'driver_license', 'vehicle_registration', 'vehicle_photo')`,
    );
    await queryRunner.query(`
      CREATE TABLE "provider_documents" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "provider_id" uuid NOT NULL,
        "doc_type" "public"."provider_documents_doc_type_enum" NOT NULL,
        "file_url" text NOT NULL,
        "cloudinary_id" varchar,
        "uploaded_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_provider_documents" PRIMARY KEY ("id"),
        CONSTRAINT "FK_provider_documents_provider_id" FOREIGN KEY ("provider_id") REFERENCES "providers"("user_id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_provider_documents_provider_id" ON "provider_documents" ("provider_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_provider_documents_provider_id"`);
    await queryRunner.query(`DROP TABLE "provider_documents"`);
    await queryRunner.query(`DROP TYPE "public"."provider_documents_doc_type_enum"`);
  }
}
