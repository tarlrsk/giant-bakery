/*
  Warnings:

  - You are about to drop the column `name_th` on the `MasterCakeBase` table. All the data in the column will be lost.
  - You are about to drop the column `name_th` on the `MasterCakeBottomEdge` table. All the data in the column will be lost.
  - You are about to drop the column `name_th` on the `MasterCakeCream` table. All the data in the column will be lost.
  - You are about to drop the column `name_th` on the `MasterCakeDecoration` table. All the data in the column will be lost.
  - You are about to drop the column `name_th` on the `MasterCakeFilling` table. All the data in the column will be lost.
  - You are about to drop the column `name_th` on the `MasterCakePound` table. All the data in the column will be lost.
  - You are about to drop the column `name_th` on the `MasterCakeSurface` table. All the data in the column will be lost.
  - You are about to drop the column `name_th` on the `MasterCakeTopEdge` table. All the data in the column will be lost.
  - Added the required column `name` to the `MasterCakeBase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `MasterCakeBottomEdge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `MasterCakeCream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `MasterCakeDecoration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `MasterCakeFilling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `MasterCakePound` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `MasterCakeSurface` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `MasterCakeTopEdge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MasterCakeBase" DROP COLUMN "name_th",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MasterCakeBottomEdge" DROP COLUMN "name_th",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MasterCakeCream" DROP COLUMN "name_th",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MasterCakeDecoration" DROP COLUMN "name_th",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MasterCakeFilling" DROP COLUMN "name_th",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MasterCakePound" DROP COLUMN "name_th",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MasterCakeSurface" DROP COLUMN "name_th",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MasterCakeTopEdge" DROP COLUMN "name_th",
ADD COLUMN     "name" TEXT NOT NULL;
