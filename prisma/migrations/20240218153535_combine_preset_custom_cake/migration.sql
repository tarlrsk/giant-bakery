/*
  Warnings:

  - The values [PRESET_CAKE,CUSTOM_CAKE] on the enum `CartItemType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CartItemType_new" AS ENUM ('CAKE', 'REFRESHMENT', 'SNACK_BOX');
ALTER TABLE "CartItem" ALTER COLUMN "type" TYPE "CartItemType_new" USING ("type"::text::"CartItemType_new");
ALTER TYPE "CartItemType" RENAME TO "CartItemType_old";
ALTER TYPE "CartItemType_new" RENAME TO "CartItemType";
DROP TYPE "CartItemType_old";
COMMIT;
