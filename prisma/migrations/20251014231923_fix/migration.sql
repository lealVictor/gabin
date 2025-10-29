/*
  Warnings:

  - You are about to drop the column `name` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `whatsapp` on the `Lead` table. All the data in the column will be lost.
  - Added the required column `lead_name` to the `Lead` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Lead" DROP COLUMN "name",
DROP COLUMN "whatsapp",
ADD COLUMN     "lead_name" TEXT NOT NULL,
ADD COLUMN     "lead_whats" TEXT;

-- AlterTable
ALTER TABLE "public"."Task" ADD COLUMN     "bairro" TEXT,
ADD COLUMN     "cep" TEXT,
ADD COLUMN     "cidade" TEXT,
ADD COLUMN     "logradouro" TEXT,
ADD COLUMN     "meta" TEXT,
ADD COLUMN     "numero" TEXT,
ADD COLUMN     "uf" TEXT;
