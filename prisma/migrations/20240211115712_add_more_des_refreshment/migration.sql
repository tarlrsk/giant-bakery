-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('PIECE');

-- AlterTable
ALTER TABLE "Refreshment" ADD COLUMN     "ingredient" TEXT,
ADD COLUMN     "quantity" INTEGER,
ADD COLUMN     "unitType" "UnitType";
