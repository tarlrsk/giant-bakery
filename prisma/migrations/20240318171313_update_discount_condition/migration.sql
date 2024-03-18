/*
  Warnings:

  - You are about to drop the column `condition` on the `Discount` table. All the data in the column will be lost.
  - Added the required column `conditionValue` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `pct` on the `Discount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Discount" DROP COLUMN "condition",
ADD COLUMN     "conditionValue" INTEGER NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
DROP COLUMN "pct",
ADD COLUMN     "pct" DOUBLE PRECISION NOT NULL;
