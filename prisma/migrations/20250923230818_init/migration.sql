/*
  Warnings:

  - You are about to drop the column `employeeId` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CompanyOwners` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `businessId` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Calendar" DROP CONSTRAINT "Calendar_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Employee" DROP CONSTRAINT "Employee_clientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Employee" DROP CONSTRAINT "Employee_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Subscription" DROP CONSTRAINT "Subscription_clientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CompanyOwners" DROP CONSTRAINT "_CompanyOwners_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CompanyOwners" DROP CONSTRAINT "_CompanyOwners_B_fkey";

-- AlterTable
ALTER TABLE "public"."Calendar" DROP COLUMN "employeeId",
ADD COLUMN     "businessId" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Subscription" DROP COLUMN "clientId",
ADD COLUMN     "businessId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."Client";

-- DropTable
DROP TABLE "public"."Employee";

-- DropTable
DROP TABLE "public"."_CompanyOwners";

-- CreateTable
CREATE TABLE "public"."Business" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "color" TEXT,
    "friendlyUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CalendarUser" (
    "id" SERIAL NOT NULL,
    "calendarId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "CalendarUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_BusinessOwners" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BusinessOwners_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Business_friendlyUrl_key" ON "public"."Business"("friendlyUrl");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarUser_calendarId_userId_key" ON "public"."CalendarUser"("calendarId", "userId");

-- CreateIndex
CREATE INDEX "_BusinessOwners_B_index" ON "public"."_BusinessOwners"("B");

-- AddForeignKey
ALTER TABLE "public"."Calendar" ADD CONSTRAINT "Calendar_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "public"."Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CalendarUser" ADD CONSTRAINT "CalendarUser_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "public"."Calendar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CalendarUser" ADD CONSTRAINT "CalendarUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "public"."Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BusinessOwners" ADD CONSTRAINT "_BusinessOwners_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BusinessOwners" ADD CONSTRAINT "_BusinessOwners_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
