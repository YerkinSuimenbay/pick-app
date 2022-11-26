import { MigrationInterface, QueryRunner } from 'typeorm'

export class startEndDatesImplemented1669463219050
  implements MigrationInterface
{
  name = 'startEndDatesImplemented1669463219050'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "orders"`)
    await queryRunner.query(`DELETE FROM "offers"`)
    await queryRunner.query(`DELETE FROM "packages"`)
    await queryRunner.query(`DELETE FROM "couriers"`)

    await queryRunner.query(`ALTER TABLE "packages" DROP COLUMN "send_date"`)
    await queryRunner.query(
      `ALTER TABLE "packages" DROP COLUMN "delivery_date"`,
    )
    await queryRunner.query(`ALTER TABLE "couriers" DROP COLUMN "date"`)
    await queryRunner.query(
      `ALTER TABLE "packages" ADD "start_date" TIMESTAMP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "packages" ADD "end_date" TIMESTAMP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "couriers" ADD "start_date" TIMESTAMP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "couriers" ADD "end_date" TIMESTAMP NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "couriers" DROP COLUMN "end_date"`)
    await queryRunner.query(`ALTER TABLE "couriers" DROP COLUMN "start_date"`)
    await queryRunner.query(`ALTER TABLE "packages" DROP COLUMN "end_date"`)
    await queryRunner.query(`ALTER TABLE "packages" DROP COLUMN "start_date"`)
    await queryRunner.query(
      `ALTER TABLE "couriers" ADD "date" TIMESTAMP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "packages" ADD "delivery_date" TIMESTAMP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "packages" ADD "send_date" TIMESTAMP NOT NULL`,
    )
  }
}
