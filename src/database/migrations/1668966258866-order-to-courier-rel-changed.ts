import { MigrationInterface, QueryRunner } from 'typeorm'

export class orderToCourierRelChanged1668966258866
  implements MigrationInterface
{
  name = 'orderToCourierRelChanged1668966258866'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_0e0e0b6db50dc05c12031bce4c3"`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "REL_0e0e0b6db50dc05c12031bce4c"`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_0e0e0b6db50dc05c12031bce4c3" FOREIGN KEY ("courier_id") REFERENCES "couriers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_0e0e0b6db50dc05c12031bce4c3"`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "REL_0e0e0b6db50dc05c12031bce4c" UNIQUE ("courier_id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_0e0e0b6db50dc05c12031bce4c3" FOREIGN KEY ("courier_id") REFERENCES "couriers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
  }
}
