import { MigrationInterface, QueryRunner } from 'typeorm'

export class cityCountryEntitiyCreated1669372799017
  implements MigrationInterface
{
  name = 'cityCountryEntitiyCreated1669372799017'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "countries" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b2d7006793e8697ab3ae2deff18" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "cities" ("id" SERIAL NOT NULL, "geonameid" integer NOT NULL, "name" character varying(255) NOT NULL, "subcountry" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "country_id" integer NOT NULL, CONSTRAINT "UQ_8ec4e1037116085c31a4728a151" UNIQUE ("geonameid"), CONSTRAINT "PK_4762ffb6e5d198cfec5606bc11e" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "cities" ADD CONSTRAINT "FK_4aa0d9a52c36ff93415934e2d2b" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cities" DROP CONSTRAINT "FK_4aa0d9a52c36ff93415934e2d2b"`,
    )
    await queryRunner.query(`DROP TABLE "cities"`)
    await queryRunner.query(`DROP TABLE "countries"`)
  }
}
