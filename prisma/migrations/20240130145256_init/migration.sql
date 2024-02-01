-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'ADMIN');

-- CreateEnum
CREATE TYPE "RefreshmentType" AS ENUM ('BAKERY', 'BEVERAGE');

-- CreateEnum
CREATE TYPE "RefreshmentCategory" AS ENUM ('BREAD', 'PIE', 'COOKIE', 'SNACK');

-- CreateEnum
CREATE TYPE "CakeType" AS ENUM ('CUSTOM', 'PRESET');

-- CreateEnum
CREATE TYPE "CartItemType" AS ENUM ('PRESET_CAKE', 'CUSTOM_CAKE', 'REFRESHMENT', 'SNACK_BOX');

-- CreateEnum
CREATE TYPE "CartType" AS ENUM ('MEMBER', 'GUEST');

-- CreateEnum
CREATE TYPE "VariantType" AS ENUM ('BASE', 'FILLINGS', 'FROSTINGS', 'CREAM');

-- CreateEnum
CREATE TYPE "StockStatus" AS ENUM ('IN_STOCK', 'LOW', 'OUT_OF_STOCK');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('WHOLESALE', 'RETAIL');

-- CreateEnum
CREATE TYPE "ReceivedVia" AS ENUM ('PICK_UP', 'DELIVERY');

-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('NORMAL', 'CONTROL');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING_ORDER', 'ON_PROCESS', 'PENDING_PAYMENT', 'PENDING_DELIVERY', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('FULL_PAYMENT', 'PARTIAL_PAYMENT');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('COMPLETE', 'INCOMPLETE');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('NORMAL', 'SNACK_BOX');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "hashedPassword" TEXT,
    "image" TEXT,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "type" "CartType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerAddress" (
    "id" TEXT NOT NULL,
    "cFirstName" TEXT NOT NULL,
    "cLastName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "subdistrict" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CustomerAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cake" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageFileName" TEXT,
    "image" TEXT,
    "type" "CakeType" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Cake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomCake" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CakeType" NOT NULL DEFAULT 'CUSTOM',
    "price" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomCake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageFileName" TEXT,
    "image" TEXT,
    "type" "VariantType" NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "isVisualized" BOOLEAN NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Refreshment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageFileName" TEXT,
    "image" TEXT,
    "type" "RefreshmentType" NOT NULL,
    "category" "RefreshmentCategory",
    "status" "StockStatus" NOT NULL,
    "minQty" INTEGER NOT NULL,
    "maxQty" INTEGER NOT NULL,
    "currQty" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "snackBoxId" TEXT,

    CONSTRAINT "Refreshment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SnackBox" (
    "_id" TEXT NOT NULL,

    CONSTRAINT "SnackBox_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "type" "OrderType" NOT NULL,
    "delivery" "DeliveryType" NOT NULL,
    "receivedVia" "ReceivedVia" NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "orderedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "cakeId" TEXT NOT NULL,
    "snackId" TEXT NOT NULL,
    "customCakeId" TEXT NOT NULL,
    "snackBoxId" TEXT NOT NULL,
    "orderId" TEXT,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "provider" TEXT NOT NULL,
    "type" "PaymentType" NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discount" (
    "id" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "pct" TEXT NOT NULL,
    "type" "DiscountType" NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CartToCustomCake" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CartToRefreshment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CartToSnackBox" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CakeToVariant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CakeToCart" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CustomCakeToVariant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerAddress_userId_key" ON "CustomerAddress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_userId_key" ON "Order"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_CartToCustomCake_AB_unique" ON "_CartToCustomCake"("A", "B");

-- CreateIndex
CREATE INDEX "_CartToCustomCake_B_index" ON "_CartToCustomCake"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CartToRefreshment_AB_unique" ON "_CartToRefreshment"("A", "B");

-- CreateIndex
CREATE INDEX "_CartToRefreshment_B_index" ON "_CartToRefreshment"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CartToSnackBox_AB_unique" ON "_CartToSnackBox"("A", "B");

-- CreateIndex
CREATE INDEX "_CartToSnackBox_B_index" ON "_CartToSnackBox"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CakeToVariant_AB_unique" ON "_CakeToVariant"("A", "B");

-- CreateIndex
CREATE INDEX "_CakeToVariant_B_index" ON "_CakeToVariant"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CakeToCart_AB_unique" ON "_CakeToCart"("A", "B");

-- CreateIndex
CREATE INDEX "_CakeToCart_B_index" ON "_CakeToCart"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CustomCakeToVariant_AB_unique" ON "_CustomCakeToVariant"("A", "B");

-- CreateIndex
CREATE INDEX "_CustomCakeToVariant_B_index" ON "_CustomCakeToVariant"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refreshment" ADD CONSTRAINT "Refreshment_snackBoxId_fkey" FOREIGN KEY ("snackBoxId") REFERENCES "SnackBox"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "Discount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_cakeId_fkey" FOREIGN KEY ("cakeId") REFERENCES "Cake"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_customCakeId_fkey" FOREIGN KEY ("customCakeId") REFERENCES "CustomCake"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_snackId_fkey" FOREIGN KEY ("snackId") REFERENCES "Refreshment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_snackBoxId_fkey" FOREIGN KEY ("snackBoxId") REFERENCES "SnackBox"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CartToCustomCake" ADD CONSTRAINT "_CartToCustomCake_A_fkey" FOREIGN KEY ("A") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CartToCustomCake" ADD CONSTRAINT "_CartToCustomCake_B_fkey" FOREIGN KEY ("B") REFERENCES "CustomCake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CartToRefreshment" ADD CONSTRAINT "_CartToRefreshment_A_fkey" FOREIGN KEY ("A") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CartToRefreshment" ADD CONSTRAINT "_CartToRefreshment_B_fkey" FOREIGN KEY ("B") REFERENCES "Refreshment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CartToSnackBox" ADD CONSTRAINT "_CartToSnackBox_A_fkey" FOREIGN KEY ("A") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CartToSnackBox" ADD CONSTRAINT "_CartToSnackBox_B_fkey" FOREIGN KEY ("B") REFERENCES "SnackBox"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CakeToVariant" ADD CONSTRAINT "_CakeToVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "Cake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CakeToVariant" ADD CONSTRAINT "_CakeToVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CakeToCart" ADD CONSTRAINT "_CakeToCart_A_fkey" FOREIGN KEY ("A") REFERENCES "Cake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CakeToCart" ADD CONSTRAINT "_CakeToCart_B_fkey" FOREIGN KEY ("B") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomCakeToVariant" ADD CONSTRAINT "_CustomCakeToVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "CustomCake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomCakeToVariant" ADD CONSTRAINT "_CustomCakeToVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
