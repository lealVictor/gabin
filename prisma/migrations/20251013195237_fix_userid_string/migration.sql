/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `AppointmentDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AppointmentMaster` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Calendar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CalendarUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Plan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Workspace` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_WorkspaceOwners` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'SERVER', 'ADMIN', 'SUPPORT');

-- DropForeignKey
ALTER TABLE "public"."AppointmentDetail" DROP CONSTRAINT "AppointmentDetail_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AppointmentMaster" DROP CONSTRAINT "AppointmentMaster_calendarId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AppointmentMaster" DROP CONSTRAINT "AppointmentMaster_customerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Calendar" DROP CONSTRAINT "Calendar_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CalendarUser" DROP CONSTRAINT "CalendarUser_calendarId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CalendarUser" DROP CONSTRAINT "CalendarUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Subscription" DROP CONSTRAINT "Subscription_planId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Subscription" DROP CONSTRAINT "Subscription_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_WorkspaceOwners" DROP CONSTRAINT "_WorkspaceOwners_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_WorkspaceOwners" DROP CONSTRAINT "_WorkspaceOwners_B_fkey";

-- AlterTable
ALTER TABLE "public"."AuditLog" ALTER COLUMN "entityId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "emailVerified",
DROP COLUMN "image",
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "public"."AppointmentDetail";

-- DropTable
DROP TABLE "public"."AppointmentMaster";

-- DropTable
DROP TABLE "public"."Calendar";

-- DropTable
DROP TABLE "public"."CalendarUser";

-- DropTable
DROP TABLE "public"."Customer";

-- DropTable
DROP TABLE "public"."Plan";

-- DropTable
DROP TABLE "public"."Subscription";

-- DropTable
DROP TABLE "public"."Workspace";

-- DropTable
DROP TABLE "public"."_WorkspaceOwners";

-- DropEnum
DROP TYPE "public"."AppointmentStatus";

-- CreateTable
CREATE TABLE "public"."Request" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phone" TEXT,
    "endereco" TEXT NOT NULL,
    "problema" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ticket" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Request" ADD CONSTRAINT "Request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
