import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1747477427376 implements MigrationInterface {
  name = 'Migration1747477427376'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "thumbnail" character varying, "icon" character varying, "slug" character varying NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'published', "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "parent_id" integer, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "posts" ("id" SERIAL NOT NULL, "title" character varying(500) NOT NULL, "slug" character varying(1000) NOT NULL, "description" character varying(1000) NOT NULL, "thumbnail" character varying, "content" text NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'published', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "auth_id" integer, CONSTRAINT "UQ_54ddf9075260407dcfdd7248577" UNIQUE ("slug"), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "avatar" character varying(255), "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'activated', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "contacts" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "message" text NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "licenses" ("id" SERIAL NOT NULL, "licensed_to" character varying(255) NOT NULL, "activated_at" date NOT NULL, "expires_at" date NOT NULL, "token" text NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'activated', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_da5021501ce80efa03de6f40086" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "post_category" ("post_id" integer NOT NULL, "category_id" integer NOT NULL, CONSTRAINT "PK_adbadf9ed503800035d1ddcb331" PRIMARY KEY ("post_id", "category_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_44d258cc3d7387a9a39ec8c27a" ON "post_category" ("post_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_86920132d7d239eea7e091bf47" ON "post_category" ("category_id") `
    )
    await queryRunner.query(
      `CREATE TABLE "categories_closure" ("id_ancestor" integer NOT NULL, "id_descendant" integer NOT NULL, CONSTRAINT "PK_dc67f6a82852c15ec6e4243398d" PRIMARY KEY ("id_ancestor", "id_descendant"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ea1e9c4eea91160dfdb4318778" ON "categories_closure" ("id_ancestor") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_51fff5114cc41723e8ca36cf22" ON "categories_closure" ("id_descendant") `
    )
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "FK_88cea2dc9c31951d06437879b40" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_ae223bc32c1202f8fff655dc0c1" FOREIGN KEY ("auth_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "post_category" ADD CONSTRAINT "FK_44d258cc3d7387a9a39ec8c27a4" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "post_category" ADD CONSTRAINT "FK_86920132d7d239eea7e091bf477" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "categories_closure" ADD CONSTRAINT "FK_ea1e9c4eea91160dfdb4318778d" FOREIGN KEY ("id_ancestor") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "categories_closure" ADD CONSTRAINT "FK_51fff5114cc41723e8ca36cf227" FOREIGN KEY ("id_descendant") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories_closure" DROP CONSTRAINT "FK_51fff5114cc41723e8ca36cf227"`
    )
    await queryRunner.query(
      `ALTER TABLE "categories_closure" DROP CONSTRAINT "FK_ea1e9c4eea91160dfdb4318778d"`
    )
    await queryRunner.query(
      `ALTER TABLE "post_category" DROP CONSTRAINT "FK_86920132d7d239eea7e091bf477"`
    )
    await queryRunner.query(
      `ALTER TABLE "post_category" DROP CONSTRAINT "FK_44d258cc3d7387a9a39ec8c27a4"`
    )
    await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_ae223bc32c1202f8fff655dc0c1"`)
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "FK_88cea2dc9c31951d06437879b40"`
    )
    await queryRunner.query(`DROP INDEX "public"."IDX_51fff5114cc41723e8ca36cf22"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_ea1e9c4eea91160dfdb4318778"`)
    await queryRunner.query(`DROP TABLE "categories_closure"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_86920132d7d239eea7e091bf47"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_44d258cc3d7387a9a39ec8c27a"`)
    await queryRunner.query(`DROP TABLE "post_category"`)
    await queryRunner.query(`DROP TABLE "licenses"`)
    await queryRunner.query(`DROP TABLE "contacts"`)
    await queryRunner.query(`DROP TABLE "users"`)
    await queryRunner.query(`DROP TABLE "posts"`)
    await queryRunner.query(`DROP TABLE "categories"`)
  }
}
