import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1747150379050 implements MigrationInterface {
  name = 'Migration1747150379050'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "status" varchar(50) NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`
    )
    await queryRunner.query(
      `CREATE TABLE "licenses" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "licensed_to" varchar NOT NULL, "activated_at" date NOT NULL, "expires_at" date NOT NULL, "token" text NOT NULL, "status" varchar(50) NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`
    )
    await queryRunner.query(
      `CREATE TABLE "posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "thumbnail" varchar, "images" text, "content" text NOT NULL, "status" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`
    )
    await queryRunner.query(
      `CREATE TABLE "contacts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "message" text NOT NULL, "status" varchar(50) NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "contacts"`)
    await queryRunner.query(`DROP TABLE "posts"`)
    await queryRunner.query(`DROP TABLE "licenses"`)
    await queryRunner.query(`DROP TABLE "users"`)
  }
}
