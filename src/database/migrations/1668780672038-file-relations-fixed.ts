import { MigrationInterface, QueryRunner } from 'typeorm'

export class fileRelationsFixed1668780672038 implements MigrationInterface {
  name = 'fileRelationsFixed1668780672038'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "files" DROP CONSTRAINT "FK_a7435dbb7583938d5e7d1376041"`,
    )
    await queryRunner.query(
      `ALTER TABLE "files" RENAME COLUMN "user_id" TO "user_id_image_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "files" ADD CONSTRAINT "FK_f3f7ac6c337f11363af2f907194" FOREIGN KEY ("user_id_image_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "files" DROP CONSTRAINT "FK_f3f7ac6c337f11363af2f907194"`,
    )
    await queryRunner.query(
      `ALTER TABLE "files" RENAME COLUMN "user_id_image_id" TO "user_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "files" ADD CONSTRAINT "FK_a7435dbb7583938d5e7d1376041" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }
}
