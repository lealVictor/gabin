/*
  Warnings:

  - The values [PENDING] on the enum `TaskStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `message` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `categoria` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descricao` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prioridade` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulo` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TicketType" AS ENUM ('GENERAL', 'CADASTRO', 'SUPORTE', 'DEMANDA');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."TaskStatus_new" AS ENUM ('IN_PROGRESS', 'COMPLETED');
ALTER TABLE "public"."Task" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Task" ALTER COLUMN "status" TYPE "public"."TaskStatus_new" USING ("status"::text::"public"."TaskStatus_new");
ALTER TYPE "public"."TaskStatus" RENAME TO "TaskStatus_old";
ALTER TYPE "public"."TaskStatus_new" RENAME TO "TaskStatus";
DROP TYPE "public"."TaskStatus_old";
ALTER TABLE "public"."Task" ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Ticket" DROP CONSTRAINT "Ticket_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Task" ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS';

-- AlterTable
ALTER TABLE "public"."Ticket" DROP COLUMN "message",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
ADD COLUMN     "categoria" TEXT NOT NULL,
ADD COLUMN     "descricao" TEXT NOT NULL,
ADD COLUMN     "prioridade" TEXT NOT NULL,
ADD COLUMN     "titulo" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "subject" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
