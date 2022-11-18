import { MigrationInterface, QueryRunner } from 'typeorm'

export class courierIsActiveDefaultToTrue1668783481453
  implements MigrationInterface
{
  name = 'courierIsActiveDefaultToTrue1668783481453'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "couriers" ALTER COLUMN "is_active" SET DEFAULT true`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "couriers" ALTER COLUMN "is_active" DROP DEFAULT`,
    )
  }
}
