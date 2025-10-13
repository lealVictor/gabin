/*
  Warnings:

  - You are about to drop the `Agenda` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Agendamento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Empresa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Funcionario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Agenda" DROP CONSTRAINT "Agenda_funcionarioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Agendamento" DROP CONSTRAINT "Agendamento_agendaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Funcionario" DROP CONSTRAINT "Funcionario_empresaId_fkey";

-- DropTable
DROP TABLE "public"."Agenda";

-- DropTable
DROP TABLE "public"."Agendamento";

-- DropTable
DROP TABLE "public"."Empresa";

-- DropTable
DROP TABLE "public"."Funcionario";

-- CreateTable
CREATE TABLE "public"."Client" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "color" TEXT,
    "slug" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Employee" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Calendar" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,

    CONSTRAINT "Calendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AppointmentMaster" (
    "id" SERIAL NOT NULL,
    "customer" TEXT NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "calendarId" INTEGER NOT NULL,

    CONSTRAINT "AppointmentMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AppointmentDetail" (
    "id" SERIAL NOT NULL,
    "serviceName" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "appointmentId" INTEGER NOT NULL,

    CONSTRAINT "AppointmentDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_slug_key" ON "public"."Client"("slug");

-- AddForeignKey
ALTER TABLE "public"."Employee" ADD CONSTRAINT "Employee_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Calendar" ADD CONSTRAINT "Calendar_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AppointmentMaster" ADD CONSTRAINT "AppointmentMaster_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "public"."Calendar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AppointmentDetail" ADD CONSTRAINT "AppointmentDetail_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "public"."AppointmentMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
