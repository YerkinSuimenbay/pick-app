import { MigrationInterface, QueryRunner } from 'typeorm'

export class socialIdAdded1670272032913 implements MigrationInterface {
  name = 'socialIdAdded1670272032913'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "social_id" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ADD "socialProvider" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "phone" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "id_type" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "id_number" DROP NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "id_number" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "id_type" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "phone" SET NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "socialProvider"`)
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "social_id"`)
  }
}
