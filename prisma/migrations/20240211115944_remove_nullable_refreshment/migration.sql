/*
  Warnings:

  - Made the column `quantity` on table `Refreshment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `unitType` on table `Refreshment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Refreshment" ALTER COLUMN "quantity" SET NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 0,
ALTER COLUMN "unitType" SET NOT NULL,
ALTER COLUMN "unitType" SET DEFAULT 'PIECE';
