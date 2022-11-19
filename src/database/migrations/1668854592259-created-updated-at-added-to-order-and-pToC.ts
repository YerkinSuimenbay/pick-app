import { MigrationInterface, QueryRunner } from 'typeorm'

export class createdUpdatedAtAddedToOrderAndPToC1668854592259
  implements MigrationInterface
{
  name = 'createdUpdatedAtAddedToOrderAndPToC1668854592259'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "packageToCouriers" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "packageToCouriers" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "updated_at"`)
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "created_at"`)
    await queryRunner.query(
      `ALTER TABLE "packageToCouriers" DROP COLUMN "updated_at"`,
    )
    await queryRunner.query(
      `ALTER TABLE "packageToCouriers" DROP COLUMN "created_at"`,
    )
  }
}
