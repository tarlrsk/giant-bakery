/*
  Warnings:

  - The values [CAKE] on the enum `CartItemType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `type` on the `Cake` table. All the data in the column will be lost.
  - You are about to drop the column `bottomEdgeColor` on the `CustomerCake` table. All the data in the column will be lost.
  - You are about to drop the column `creamColor` on the `CustomerCake` table. All the data in the column will be lost.
  - You are about to drop the column `topEdgeColor` on the `CustomerCake` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CartItemType_new" AS ENUM ('PRESET_CAKE', 'CUSTOM_CAKE', 'REFRESHMENT', 'SNACK_BOX');
ALTER TABLE "CartItem" ALTER COLUMN "type" TYPE "CartItemType_new" USING ("type"::text::"CartItemType_new");
ALTER TYPE "CartItemType" RENAME TO "CartItemType_old";
ALTER TYPE "CartItemType_new" RENAME TO "CartItemType";
DROP TYPE "CartItemType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "CustomerCake" DROP CONSTRAINT "CustomerCake_cakeId_fkey";

-- AlterTable
ALTER TABLE "Cake" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "CustomerCake" DROP COLUMN "bottomEdgeColor",
DROP COLUMN "creamColor",
DROP COLUMN "topEdgeColor",
ADD COLUMN     "cakeMessage" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "cakeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MasterCakeBottomEdge" ADD COLUMN     "color" TEXT;

-- AlterTable
ALTER TABLE "MasterCakeCream" ADD COLUMN     "color" TEXT;

-- AlterTable
ALTER TABLE "MasterCakeTopEdge" ADD COLUMN     "color" TEXT;

-- AlterTable
ALTER TABLE "OrderCustomerCake" ADD COLUMN     "cakeMessage" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "CustomerCake" ADD CONSTRAINT "CustomerCake_cakeId_fkey" FOREIGN KEY ("cakeId") REFERENCES "Cake"("id") ON DELETE SET NULL ON UPDATE CASCADE;
