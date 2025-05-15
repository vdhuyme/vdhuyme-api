import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1747294103882 implements MigrationInterface {
    name = 'Migration1747294103882'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(255) NOT NULL, "email" varchar(255) NOT NULL, "password" varchar(255) NOT NULL, "status" varchar(50) NOT NULL DEFAULT ('activated'), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "slug" varchar NOT NULL, "status" varchar(50) NOT NULL DEFAULT ('published'), "description" text, "nsleft" integer NOT NULL DEFAULT (1), "nsright" integer NOT NULL DEFAULT (2), "parentId" integer, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"))`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "user_id" bigint NOT NULL, "title" varchar(500) NOT NULL, "slug" varchar(1000) NOT NULL, "description" varchar(1000) NOT NULL, "thumbnail" varchar, "content" text NOT NULL, "status" varchar(50) NOT NULL DEFAULT ('published'), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_54ddf9075260407dcfdd7248577" UNIQUE ("slug"))`);
        await queryRunner.query(`CREATE TABLE "licenses" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "licensed_to" varchar(255) NOT NULL, "activated_at" date NOT NULL, "expires_at" date NOT NULL, "token" text NOT NULL, "status" varchar(50) NOT NULL DEFAULT ('activated'), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "contacts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(255) NOT NULL, "email" varchar(255) NOT NULL, "message" text NOT NULL, "status" varchar(50) NOT NULL DEFAULT ('pending'), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "post_category" ("post_id" integer NOT NULL, "category_id" integer NOT NULL, PRIMARY KEY ("post_id", "category_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_44d258cc3d7387a9a39ec8c27a" ON "post_category" ("post_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_86920132d7d239eea7e091bf47" ON "post_category" ("category_id") `);
        await queryRunner.query(`CREATE TABLE "temporary_categories" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "slug" varchar NOT NULL, "status" varchar(50) NOT NULL DEFAULT ('published'), "description" text, "nsleft" integer NOT NULL DEFAULT (1), "nsright" integer NOT NULL DEFAULT (2), "parentId" integer, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"), CONSTRAINT "FK_9a6f051e66982b5f0318981bcaa" FOREIGN KEY ("parentId") REFERENCES "categories" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_categories"("id", "name", "slug", "status", "description", "nsleft", "nsright", "parentId") SELECT "id", "name", "slug", "status", "description", "nsleft", "nsright", "parentId" FROM "categories"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`ALTER TABLE "temporary_categories" RENAME TO "categories"`);
        await queryRunner.query(`DROP INDEX "IDX_44d258cc3d7387a9a39ec8c27a"`);
        await queryRunner.query(`DROP INDEX "IDX_86920132d7d239eea7e091bf47"`);
        await queryRunner.query(`CREATE TABLE "temporary_post_category" ("post_id" integer NOT NULL, "category_id" integer NOT NULL, CONSTRAINT "FK_44d258cc3d7387a9a39ec8c27a4" FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_86920132d7d239eea7e091bf477" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("post_id", "category_id"))`);
        await queryRunner.query(`INSERT INTO "temporary_post_category"("post_id", "category_id") SELECT "post_id", "category_id" FROM "post_category"`);
        await queryRunner.query(`DROP TABLE "post_category"`);
        await queryRunner.query(`ALTER TABLE "temporary_post_category" RENAME TO "post_category"`);
        await queryRunner.query(`CREATE INDEX "IDX_44d258cc3d7387a9a39ec8c27a" ON "post_category" ("post_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_86920132d7d239eea7e091bf47" ON "post_category" ("category_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_86920132d7d239eea7e091bf47"`);
        await queryRunner.query(`DROP INDEX "IDX_44d258cc3d7387a9a39ec8c27a"`);
        await queryRunner.query(`ALTER TABLE "post_category" RENAME TO "temporary_post_category"`);
        await queryRunner.query(`CREATE TABLE "post_category" ("post_id" integer NOT NULL, "category_id" integer NOT NULL, PRIMARY KEY ("post_id", "category_id"))`);
        await queryRunner.query(`INSERT INTO "post_category"("post_id", "category_id") SELECT "post_id", "category_id" FROM "temporary_post_category"`);
        await queryRunner.query(`DROP TABLE "temporary_post_category"`);
        await queryRunner.query(`CREATE INDEX "IDX_86920132d7d239eea7e091bf47" ON "post_category" ("category_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_44d258cc3d7387a9a39ec8c27a" ON "post_category" ("post_id") `);
        await queryRunner.query(`ALTER TABLE "categories" RENAME TO "temporary_categories"`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "slug" varchar NOT NULL, "status" varchar(50) NOT NULL DEFAULT ('published'), "description" text, "nsleft" integer NOT NULL DEFAULT (1), "nsright" integer NOT NULL DEFAULT (2), "parentId" integer, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"))`);
        await queryRunner.query(`INSERT INTO "categories"("id", "name", "slug", "status", "description", "nsleft", "nsright", "parentId") SELECT "id", "name", "slug", "status", "description", "nsleft", "nsright", "parentId" FROM "temporary_categories"`);
        await queryRunner.query(`DROP TABLE "temporary_categories"`);
        await queryRunner.query(`DROP INDEX "IDX_86920132d7d239eea7e091bf47"`);
        await queryRunner.query(`DROP INDEX "IDX_44d258cc3d7387a9a39ec8c27a"`);
        await queryRunner.query(`DROP TABLE "post_category"`);
        await queryRunner.query(`DROP TABLE "contacts"`);
        await queryRunner.query(`DROP TABLE "licenses"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
