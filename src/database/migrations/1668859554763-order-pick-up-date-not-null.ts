import { MigrationInterface, QueryRunner } from 'typeorm'

export class orderPickUpDateNotNull1668859554763 implements MigrationInterface {
  name = 'orderPickUpDateNotNull1668859554763'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "pick_up_date" SET NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "pick_up_date" DROP NOT NULL`,
    )
  }
}
