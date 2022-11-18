import { MigrationInterface, QueryRunner } from 'typeorm'

export class packageStatusDefaultToNew1668772066386
  implements MigrationInterface
{
  name = 'packageStatusDefaultToNew1668772066386'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "packages" ALTER COLUMN "status" SET DEFAULT 'new'`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "packages" ALTER COLUMN "status" DROP DEFAULT`,
    )
  }
}
