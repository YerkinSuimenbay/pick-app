import { MigrationInterface, QueryRunner } from 'typeorm'

export class favoritesAdded1669195970464 implements MigrationInterface {
  name = 'favoritesAdded1669195970464'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_favorites" ("user_id" integer NOT NULL, "favorite_id" integer NOT NULL, CONSTRAINT "PK_e153c9049797e4721577cdc2066" PRIMARY KEY ("user_id", "favorite_id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_5238ce0a21cc77dc16c8efe3d3" ON "user_favorites" ("user_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_c35077311a0388ade5b72a1936" ON "user_favorites" ("favorite_id") `,
    )
    await queryRunner.query(
      `ALTER TABLE "user_favorites" ADD CONSTRAINT "FK_5238ce0a21cc77dc16c8efe3d36" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_favorites" ADD CONSTRAINT "FK_c35077311a0388ade5b72a1936d" FOREIGN KEY ("favorite_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_favorites" DROP CONSTRAINT "FK_c35077311a0388ade5b72a1936d"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_favorites" DROP CONSTRAINT "FK_5238ce0a21cc77dc16c8efe3d36"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c35077311a0388ade5b72a1936"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5238ce0a21cc77dc16c8efe3d3"`,
    )
    await queryRunner.query(`DROP TABLE "user_favorites"`)
  }
}
