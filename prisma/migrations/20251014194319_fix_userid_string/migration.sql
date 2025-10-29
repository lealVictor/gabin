/*
  Warnings:

  - The primary key for the `Ticket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Ticket` table. All the data in the column will be lost.
  - The `id` column on the `Ticket` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Ticket` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Request` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `entityId` on the `AuditLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `message` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'CLOSED');

-- DropForeignKey
ALTER TABLE "public"."Request" DROP CONSTRAINT "Request_userId_fkey";

-- AlterTable
ALTER TABLE "public"."AuditLog" DROP COLUMN "entityId",
ADD COLUMN     "entityId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Ticket" DROP CONSTRAINT "Ticket_pkey",
DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "subject" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."TicketStatus" NOT NULL DEFAULT 'OPEN',
ADD CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "role",
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "image" TEXT;

-- DropTable
DROP TABLE "public"."Request";

-- DropEnum
DROP TYPE "public"."Role";

-- CreateTable
CREATE TABLE "public"."Task" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "public"."TaskStatus" NOT NULL DEFAULT 'PENDING',
    "attachment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
