/*
  Warnings:

  - You are about to drop the column `quantity` on the `Cake` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Refreshment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cake" DROP COLUMN "quantity";

-- AlterTable
ALTER TABLE "Refreshment" DROP COLUMN "quantity";
