/*
  Warnings:

  - Added the required column `type` to the `CustomerCake` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CustomerCake" ADD COLUMN     "type" "CakeType" NOT NULL;
