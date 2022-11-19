import { MigrationInterface, QueryRunner } from 'typeorm'

export class orderPackageCourierRelationFixed1668870861382
  implements MigrationInterface
{
  name = 'orderPackageCourierRelationFixed1668870861382'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "couriers" DROP CONSTRAINT "FK_e3f889b75b7c9f89ab5a1242f8d"`,
    )
    await queryRunner.query(
      `ALTER TABLE "packages" DROP CONSTRAINT "FK_de60df8c371a4c6774de6460c76"`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "UQ_02734be24fc789f3d5757736dce"`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ADD "is_active" boolean NOT NULL DEFAULT true`,
    )
    await queryRunner.query(
      `ALTER TABLE "couriers" ALTER COLUMN "user_id" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_26a131e6b65321c990a48beb21a"`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_0e0e0b6db50dc05c12031bce4c3"`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "UQ_26a131e6b65321c990a48beb21a" UNIQUE ("package_id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "UQ_0e0e0b6db50dc05c12031bce4c3" UNIQUE ("courier_id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "packages" ALTER COLUMN "user_id" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "couriers" ADD CONSTRAINT "FK_e3f889b75b7c9f89ab5a1242f8d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_26a131e6b65321c990a48beb21a" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_0e0e0b6db50dc05c12031bce4c3" FOREIGN KEY ("courier_id") REFERENCES "couriers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "packages" ADD CONSTRAINT "FK_de60df8c371a4c6774de6460c76" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "packages" DROP CONSTRAINT "FK_de60df8c371a4c6774de6460c76"`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_0e0e0b6db50dc05c12031bce4c3"`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_26a131e6b65321c990a48beb21a"`,
    )
    await queryRunner.query(
      `ALTER TABLE "couriers" DROP CONSTRAINT "FK_e3f889b75b7c9f89ab5a1242f8d"`,
    )
    await queryRunner.query(
      `ALTER TABLE "packages" ALTER COLUMN "user_id" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "UQ_0e0e0b6db50dc05c12031bce4c3"`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "UQ_26a131e6b65321c990a48beb21a"`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_0e0e0b6db50dc05c12031bce4c3" FOREIGN KEY ("courier_id") REFERENCES "couriers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_26a131e6b65321c990a48beb21a" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "couriers" ALTER COLUMN "user_id" SET NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_active"`)
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "UQ_02734be24fc789f3d5757736dce" UNIQUE ("package_id", "courier_id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "packages" ADD CONSTRAINT "FK_de60df8c371a4c6774de6460c76" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "couriers" ADD CONSTRAINT "FK_e3f889b75b7c9f89ab5a1242f8d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }
}
