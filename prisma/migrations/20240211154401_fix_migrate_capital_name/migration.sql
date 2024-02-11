/*
  Warnings:

  - You are about to drop the column `Name_th` on the `UnitType` table. All the data in the column will be lost.
  - Added the required column `name_th` to the `UnitType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UnitType" DROP COLUMN "Name_th",
ADD COLUMN     "name_th" TEXT NOT NULL;
