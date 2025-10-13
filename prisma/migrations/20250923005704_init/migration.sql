/*
  Warnings:

  - You are about to drop the column `clienteEmail` on the `Agendamento` table. All the data in the column will be lost.
  - You are about to drop the column `clienteNome` on the `Agendamento` table. All the data in the column will be lost.
  - You are about to drop the column `clienteTelefone` on the `Agendamento` table. All the data in the column will be lost.
  - You are about to drop the column `criadoEm` on the `Agendamento` table. All the data in the column will be lost.
  - You are about to drop the column `dataHora` on the `Agendamento` table. All the data in the column will be lost.
  - You are about to drop the column `empresaId` on the `Agendamento` table. All the data in the column will be lost.
  - You are about to drop the column `servicoId` on the `Agendamento` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Agendamento` table. All the data in the column will be lost.
  - You are about to drop the `Servico` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `agendaId` to the `Agendamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cliente` to the `Agendamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horario` to the `Agendamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Empresa` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Agendamento" DROP CONSTRAINT "Agendamento_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Agendamento" DROP CONSTRAINT "Agendamento_servicoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Servico" DROP CONSTRAINT "Servico_empresaId_fkey";

-- AlterTable
ALTER TABLE "public"."Agendamento" DROP COLUMN "clienteEmail",
DROP COLUMN "clienteNome",
DROP COLUMN "clienteTelefone",
DROP COLUMN "criadoEm",
DROP COLUMN "dataHora",
DROP COLUMN "empresaId",
DROP COLUMN "servicoId",
DROP COLUMN "status",
ADD COLUMN     "agendaId" INTEGER NOT NULL,
ADD COLUMN     "cliente" TEXT NOT NULL,
ADD COLUMN     "horario" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Empresa" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "public"."Servico";

-- CreateTable
CREATE TABLE "public"."Funcionario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Agenda" (
    "id" SERIAL NOT NULL,
    "funcionarioId" INTEGER NOT NULL,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Funcionario" ADD CONSTRAINT "Funcionario_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Agenda" ADD CONSTRAINT "Agenda_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "public"."Funcionario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Agendamento" ADD CONSTRAINT "Agendamento_agendaId_fkey" FOREIGN KEY ("agendaId") REFERENCES "public"."Agenda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
