/*
  Warnings:

  - The values [MEMBER] on the enum `CartType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CartType_new" AS ENUM ('CUSTOMER', 'GUEST');
ALTER TABLE "Cart" ALTER COLUMN "type" TYPE "CartType_new" USING ("type"::text::"CartType_new");
ALTER TYPE "CartType" RENAME TO "CartType_old";
ALTER TYPE "CartType_new" RENAME TO "CartType";
DROP TYPE "CartType_old";
COMMIT;
