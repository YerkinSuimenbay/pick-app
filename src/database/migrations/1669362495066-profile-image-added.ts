import { MigrationInterface, QueryRunner } from 'typeorm'

export class profileImageAdded1669362495066 implements MigrationInterface {
  name = 'profileImageAdded1669362495066'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "profile_image_id" integer`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_96d6f1aafc327443850f263cd50" UNIQUE ("profile_image_id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_96d6f1aafc327443850f263cd50" FOREIGN KEY ("profile_image_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_96d6f1aafc327443850f263cd50"`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_96d6f1aafc327443850f263cd50"`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "profile_image_id"`,
    )
  }
}
