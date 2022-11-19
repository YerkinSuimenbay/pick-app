import { MigrationInterface, QueryRunner } from 'typeorm'

export class ratingAndBookedByCourierAdded1668850368167
  implements MigrationInterface
{
  name = 'ratingAndBookedByCourierAdded1668850368167'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "ordered_by_courier"`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ADD "rating_as_courier" numeric(3,2) NOT NULL DEFAULT '0'`,
    )
    await queryRunner.query(
      `ALTER TABLE "packageToCouriers" ADD "booked_by_courier" boolean NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "packageToCouriers" DROP COLUMN "booked_by_courier"`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "rating_as_courier"`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "ordered_by_courier" boolean NOT NULL`,
    )
  }
}
