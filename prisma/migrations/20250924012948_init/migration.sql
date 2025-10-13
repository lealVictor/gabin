/*
  Warnings:

  - You are about to drop the column `businessId` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `businessId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the `Business` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BusinessOwners` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `workspaceId` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspaceId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Calendar" DROP CONSTRAINT "Calendar_businessId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Subscription" DROP CONSTRAINT "Subscription_businessId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_BusinessOwners" DROP CONSTRAINT "_BusinessOwners_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_BusinessOwners" DROP CONSTRAINT "_BusinessOwners_B_fkey";

-- AlterTable
ALTER TABLE "public"."Calendar" DROP COLUMN "businessId",
ADD COLUMN     "workspaceId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Subscription" DROP COLUMN "businessId",
ADD COLUMN     "workspaceId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."Business";

-- DropTable
DROP TABLE "public"."_BusinessOwners";

-- CreateTable
CREATE TABLE "public"."Workspace" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "color" TEXT,
    "friendlyUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_WorkspaceOwners" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_WorkspaceOwners_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_friendlyUrl_key" ON "public"."Workspace"("friendlyUrl");

-- CreateIndex
CREATE INDEX "_WorkspaceOwners_B_index" ON "public"."_WorkspaceOwners"("B");

-- AddForeignKey
ALTER TABLE "public"."Calendar" ADD CONSTRAINT "Calendar_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_WorkspaceOwners" ADD CONSTRAINT "_WorkspaceOwners_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_WorkspaceOwners" ADD CONSTRAINT "_WorkspaceOwners_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
