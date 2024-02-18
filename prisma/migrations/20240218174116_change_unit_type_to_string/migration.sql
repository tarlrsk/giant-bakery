/*
  Warnings:

  - You are about to drop the column `unitType` on the `OrderCustomerCake` table. All the data in the column will be lost.
  - You are about to drop the column `unitTypeId` on the `OrderRefreshment` table. All the data in the column will be lost.
  - You are about to drop the column `unitTypeId` on the `OrderSnackBoxRefreshment` table. All the data in the column will be lost.
  - You are about to drop the column `unitTypeId` on the `Refreshment` table. All the data in the column will be lost.
  - You are about to drop the `UnitType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderRefreshment" DROP CONSTRAINT "OrderRefreshment_unitTypeId_fkey";

-- DropForeignKey
ALTER TABLE "OrderSnackBoxRefreshment" DROP CONSTRAINT "OrderSnackBoxRefreshment_unitTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Refreshment" DROP CONSTRAINT "Refreshment_unitTypeId_fkey";

-- AlterTable
ALTER TABLE "OrderCustomerCake" DROP COLUMN "unitType";

-- AlterTable
ALTER TABLE "OrderRefreshment" DROP COLUMN "unitTypeId",
ADD COLUMN     "unitType" TEXT NOT NULL DEFAULT 'กล่อง';

-- AlterTable
ALTER TABLE "OrderSnackBoxRefreshment" DROP COLUMN "unitTypeId",
ADD COLUMN     "unitType" TEXT NOT NULL DEFAULT 'กล่อง';

-- AlterTable
ALTER TABLE "Refreshment" DROP COLUMN "unitTypeId",
ADD COLUMN     "unitType" TEXT NOT NULL DEFAULT 'กล่อง';

-- DropTable
DROP TABLE "UnitType";
