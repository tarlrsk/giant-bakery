-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "email" TEXT NOT NULL DEFAULT 'default@gmail.com',
ADD COLUMN     "receivedVia" "ReceivedVia" NOT NULL DEFAULT 'PICK_UP',
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "district" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "postcode" DROP NOT NULL,
ALTER COLUMN "province" DROP NOT NULL,
ALTER COLUMN "subdistrict" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firstName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "lastName" TEXT NOT NULL DEFAULT '';

-- DropEnum
DROP TYPE "DeliveryType";
