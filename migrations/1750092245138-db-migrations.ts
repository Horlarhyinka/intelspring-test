import { MigrationInterface, QueryRunner } from 'typeorm';

export class DbMigrations1750092245138 implements MigrationInterface {
  name = 'DbMigrations1750092245138';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bill" ("id" SERIAL NOT NULL, "public_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "expense_account" character varying NOT NULL, "item" character varying NOT NULL, "description" character varying NOT NULL, "quantity" integer NOT NULL, "total" integer NOT NULL, "price" integer NOT NULL, "user_id" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "vendorId" integer, CONSTRAINT "PK_683b47912b8b30fe71d1fa22199" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "debit_note" ("id" SERIAL NOT NULL, "public_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "expense_account" character varying NOT NULL, "item" character varying NOT NULL, "description" character varying NOT NULL, "quantity" integer NOT NULL, "total" integer NOT NULL, "price" integer NOT NULL, "user_id" integer NOT NULL, "support_document" character varying, "reason" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "vendorId" integer, CONSTRAINT "PK_61315fec6516afb787d01de857c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" SERIAL NOT NULL, "public_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "expense_account" character varying NOT NULL, "item" character varying NOT NULL, "description" character varying NOT NULL, "quantity" integer NOT NULL, "total" integer NOT NULL, "price" integer NOT NULL, "user_id" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "vendorId" integer, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "requisition" ("id" SERIAL NOT NULL, "public_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "expense_account" character varying NOT NULL, "item" character varying NOT NULL, "description" character varying NOT NULL, "quantity" integer NOT NULL, "total" integer NOT NULL, "price" integer NOT NULL, "user_id" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "vendorId" integer, CONSTRAINT "PK_53f9ab966e1c2d2d96cc5ac944a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "vendor" ("id" SERIAL NOT NULL, "public_id" character varying NOT NULL, "business_name" character varying NOT NULL, "opening_balance" integer NOT NULL, "terms" character varying NOT NULL, "tin" character varying NOT NULL, "vendor_type" character varying NOT NULL, "account_number" character varying NOT NULL, "account_name" character varying NOT NULL, "bank_name" character varying NOT NULL, "bank_code" character varying NOT NULL, "currency" character varying NOT NULL, "contact_person" character varying NOT NULL, "position" character varying NOT NULL, "email" character varying NOT NULL, "phone_number" character varying NOT NULL, "address" character varying NOT NULL, "country" character varying NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_931a23f6231a57604f5a0e32780" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bill" ADD CONSTRAINT "FK_6ad4108a2b83f0d7b7f6301373d" FOREIGN KEY ("vendorId") REFERENCES "vendor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "debit_note" ADD CONSTRAINT "FK_e0425df966e8ab873f914a66bef" FOREIGN KEY ("vendorId") REFERENCES "vendor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_ac1293b8024ff05e963d82df453" FOREIGN KEY ("vendorId") REFERENCES "vendor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "requisition" ADD CONSTRAINT "FK_e558266877d6d6c94b9434b9275" FOREIGN KEY ("vendorId") REFERENCES "vendor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "requisition" DROP CONSTRAINT "FK_e558266877d6d6c94b9434b9275"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_ac1293b8024ff05e963d82df453"`,
    );
    await queryRunner.query(
      `ALTER TABLE "debit_note" DROP CONSTRAINT "FK_e0425df966e8ab873f914a66bef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bill" DROP CONSTRAINT "FK_6ad4108a2b83f0d7b7f6301373d"`,
    );
    await queryRunner.query(`DROP TABLE "vendor"`);
    await queryRunner.query(`DROP TABLE "requisition"`);
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TABLE "debit_note"`);
    await queryRunner.query(`DROP TABLE "bill"`);
  }
}
