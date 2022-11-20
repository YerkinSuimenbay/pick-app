import { MigrationInterface, QueryRunner } from 'typeorm'

export class start1668951645754 implements MigrationInterface {
  name = 'start1668951645754'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "offers" ("id" SERIAL NOT NULL, "package_id" integer, "courier_id" integer, "offered_by_courier" boolean NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6daf4f16d629dbcbab906713220" UNIQUE ("package_id", "courier_id"), CONSTRAINT "PK_4c88e956195bba85977da21b8f4" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "couriers" ("id" SERIAL NOT NULL, "user_id" integer, "is_active" boolean NOT NULL DEFAULT true, "from" character varying NOT NULL, "to" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "flight" character varying, "fee" integer, "comment" character varying, "maximum_weight" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_141c3ed6f70beb9ddf4ab4a0e86" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" SERIAL NOT NULL, "package_id" integer NOT NULL, "courier_id" integer NOT NULL, "pick_up_date" TIMESTAMP NOT NULL, "intransit_date" TIMESTAMP, "delivered_date" TIMESTAMP, "canceled_date" TIMESTAMP, "rating" integer, "comment" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_26a131e6b65321c990a48beb21" UNIQUE ("package_id"), CONSTRAINT "REL_0e0e0b6db50dc05c12031bce4c" UNIQUE ("courier_id"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "packages" ("id" SERIAL NOT NULL, "user_id" integer, "from" character varying NOT NULL, "to" character varying NOT NULL, "send_date" TIMESTAMP NOT NULL, "delivery_date" TIMESTAMP NOT NULL, "fee" integer, "comment" character varying, "contents" character varying NOT NULL, "weight" integer, "status" character varying NOT NULL DEFAULT 'new', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_020801f620e21f943ead9311c98" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "files" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "path" character varying NOT NULL, "extension" character varying NOT NULL, "size" integer NOT NULL, "mime_type" character varying NOT NULL, "user_id_image_id" integer, "package_image_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying NOT NULL, "description" character varying, "password" character varying NOT NULL, "id_type" character varying NOT NULL, "id_number" character varying NOT NULL, "is_admin" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT true, "rating_as_courier" numeric(3,2) NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "sessions" ("id" SERIAL NOT NULL, "session_token" character varying NOT NULL, "is_active" boolean NOT NULL, "last_login_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "REL_085d540d9f418cfbdc7bd55bb1" UNIQUE ("user_id"), CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "offers" ADD CONSTRAINT "FK_20fab2de9945c2eea84a8c96024" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "offers" ADD CONSTRAINT "FK_d8f82425504a38f9ff0f721c811" FOREIGN KEY ("courier_id") REFERENCES "couriers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
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
    await queryRunner.query(
      `ALTER TABLE "files" ADD CONSTRAINT "FK_f3f7ac6c337f11363af2f907194" FOREIGN KEY ("user_id_image_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "files" ADD CONSTRAINT "FK_861e2823b320a3c26c3813248d6" FOREIGN KEY ("package_image_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19"`,
    )
    await queryRunner.query(
      `ALTER TABLE "files" DROP CONSTRAINT "FK_861e2823b320a3c26c3813248d6"`,
    )
    await queryRunner.query(
      `ALTER TABLE "files" DROP CONSTRAINT "FK_f3f7ac6c337f11363af2f907194"`,
    )
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
      `ALTER TABLE "offers" DROP CONSTRAINT "FK_d8f82425504a38f9ff0f721c811"`,
    )
    await queryRunner.query(
      `ALTER TABLE "offers" DROP CONSTRAINT "FK_20fab2de9945c2eea84a8c96024"`,
    )
    await queryRunner.query(`DROP TABLE "sessions"`)
    await queryRunner.query(`DROP TABLE "users"`)
    await queryRunner.query(`DROP TABLE "files"`)
    await queryRunner.query(`DROP TABLE "packages"`)
    await queryRunner.query(`DROP TABLE "orders"`)
    await queryRunner.query(`DROP TABLE "couriers"`)
    await queryRunner.query(`DROP TABLE "offers"`)
  }
}
