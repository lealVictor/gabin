/*
  Warnings:

  - You are about to drop the column `durationMinutes` on the `AppointmentDetail` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `AppointmentDetail` table. All the data in the column will be lost.
  - You are about to drop the column `serviceName` on the `AppointmentDetail` table. All the data in the column will be lost.
  - The `status` column on the `AppointmentDetail` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `customer` on the `AppointmentMaster` table. All the data in the column will be lost.
  - You are about to drop the column `datetime` on the `AppointmentMaster` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `AppointmentMaster` table. All the data in the column will be lost.
  - The `status` column on the `AppointmentMaster` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `plan` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Client` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[friendlyUrl]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `service` to the `AppointmentDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `AppointmentDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `AppointmentMaster` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateTime` to the `AppointmentMaster` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `AppointmentMaster` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `friendlyUrl` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."AppointmentStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'CANCELED', 'COMPLETED');

-- DropIndex
DROP INDEX "public"."Client_slug_key";

-- AlterTable
ALTER TABLE "public"."AppointmentDetail" DROP COLUMN "durationMinutes",
DROP COLUMN "price",
DROP COLUMN "serviceName",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "service" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED';

-- AlterTable
ALTER TABLE "public"."AppointmentMaster" DROP COLUMN "customer",
DROP COLUMN "datetime",
DROP COLUMN "notes",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "customerId" INTEGER NOT NULL,
ADD COLUMN     "dateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED';

-- AlterTable
ALTER TABLE "public"."Calendar" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Client" DROP COLUMN "plan",
DROP COLUMN "slug",
ADD COLUMN     "friendlyUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Employee" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "public"."Plan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "limits" JSONB,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subscription" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "planId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Customer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" SERIAL NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "changes" JSONB,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_friendlyUrl_key" ON "public"."Client"("friendlyUrl");

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AppointmentMaster" ADD CONSTRAINT "AppointmentMaster_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
