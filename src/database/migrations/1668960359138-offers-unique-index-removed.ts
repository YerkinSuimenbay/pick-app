import { MigrationInterface, QueryRunner } from 'typeorm'

export class offersUniqueIndexRemoved1668960359138
  implements MigrationInterface
{
  name = 'offersUniqueIndexRemoved1668960359138'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "offers" DROP CONSTRAINT "UQ_6daf4f16d629dbcbab906713220"`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "offers" ADD CONSTRAINT "UQ_6daf4f16d629dbcbab906713220" UNIQUE ("package_id", "courier_id")`,
    )
  }
}
