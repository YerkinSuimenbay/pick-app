import { MigrationInterface, QueryRunner } from 'typeorm'

export class packageCourierFromToChangedToCity1669374565674
  implements MigrationInterface
{
  name = 'packageCourierFromToChangedToCity1669374565674'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "couriers" DROP COLUMN "from"`)
    await queryRunner.query(`ALTER TABLE "couriers" DROP COLUMN "to"`)
    await queryRunner.query(`ALTER TABLE "packages" DROP COLUMN "from"`)
    await queryRunner.query(`ALTER TABLE "packages" DROP COLUMN "to"`)
    await queryRunner.query(`ALTER TABLE "couriers" ADD "fromId" integer`)
    await queryRunner.query(
      `ALTER TABLE "couriers" ADD CONSTRAINT "UQ_ecfbd7e65fa771aafbc9fc201f8" UNIQUE ("fromId")`,
    )
    await queryRunner.query(`ALTER TABLE "couriers" ADD "toId" integer`)
    await queryRunner.query(
      `ALTER TABLE "couriers" ADD CONSTRAINT "UQ_c1c32a542cd3378e44b619e1733" UNIQUE ("toId")`,
    )
    await queryRunner.query(`ALTER TABLE "packages" ADD "fromId" integer`)
    await queryRunner.query(
      `ALTER TABLE "packages" ADD CONSTRAINT "UQ_c6f449ac8c713daeae4094038ae" UNIQUE ("fromId")`,
    )
    await queryRunner.query(`ALTER TABLE "packages" ADD "toId" integer`)
    await queryRunner.query(
      `ALTER TABLE "packages" ADD CONSTRAINT "UQ_ea203caba28033abbd7d66b3d87" UNIQUE ("toId")`,
    )
    await queryRunner.query(
      `ALTER TABLE "couriers" ADD CONSTRAINT "FK_ecfbd7e65fa771aafbc9fc201f8" FOREIGN KEY ("fromId") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "couriers" ADD CONSTRAINT "FK_c1c32a542cd3378e44b619e1733" FOREIGN KEY ("toId") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "packages" ADD CONSTRAINT "FK_c6f449ac8c713daeae4094038ae" FOREIGN KEY ("fromId") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "packages" ADD CONSTRAINT "FK_ea203caba28033abbd7d66b3d87" FOREIGN KEY ("toId") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "packages" DROP CONSTRAINT "FK_ea203caba28033abbd7d66b3d87"`,
    )
    await queryRunner.query(
      `ALTER TABLE "packages" DROP CONSTRAINT "FK_c6f449ac8c713daeae4094038ae"`,
    )
    await queryRunner.query(
      `ALTER TABLE "couriers" DROP CONSTRAINT "FK_c1c32a542cd3378e44b619e1733"`,
    )
    await queryRunner.query(
      `ALTER TABLE "couriers" DROP CONSTRAINT "FK_ecfbd7e65fa771aafbc9fc201f8"`,
    )
    await queryRunner.query(
      `ALTER TABLE "packages" DROP CONSTRAINT "UQ_ea203caba28033abbd7d66b3d87"`,
    )
    await queryRunner.query(`ALTER TABLE "packages" DROP COLUMN "toId"`)
    await queryRunner.query(
      `ALTER TABLE "packages" DROP CONSTRAINT "UQ_c6f449ac8c713daeae4094038ae"`,
    )
    await queryRunner.query(`ALTER TABLE "packages" DROP COLUMN "fromId"`)
    await queryRunner.query(
      `ALTER TABLE "couriers" DROP CONSTRAINT "UQ_c1c32a542cd3378e44b619e1733"`,
    )
    await queryRunner.query(`ALTER TABLE "couriers" DROP COLUMN "toId"`)
    await queryRunner.query(
      `ALTER TABLE "couriers" DROP CONSTRAINT "UQ_ecfbd7e65fa771aafbc9fc201f8"`,
    )
    await queryRunner.query(`ALTER TABLE "couriers" DROP COLUMN "fromId"`)
    await queryRunner.query(
      `ALTER TABLE "packages" ADD "to" character varying NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "packages" ADD "from" character varying NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "couriers" ADD "to" character varying NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "couriers" ADD "from" character varying NOT NULL`,
    )
  }
}
