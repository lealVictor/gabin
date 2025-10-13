import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/appointments/:id → detalhes
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const appointment = await prisma.appointmentMaster.findUnique({
      where: { id: Number(params.id) },
      include: {
        customer: true,
        calendar: true,
        details: true,
      },
    });
    if (!appointment) return NextResponse.json({ error: "Agendamento não encontrado" }, { status: 404 });
    return NextResponse.json(appointment);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao buscar agendamento" }, { status: 500 });
  }
}

// PUT /api/appointments/:id → atualizar master + detalhes
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const appointmentId = Number(params.id);

    // Atualiza master
    const updatedMaster = await prisma.appointmentMaster.update({
      where: { id: appointmentId },
      data: {
        customerId: body.customerId,
        calendarId: body.calendarId,
        dateTime: new Date(body.dateTime),
        status: body.status,
      },
      include: { details: true },
    });

    // Atualiza detalhes
    if (body.details && Array.isArray(body.details)) {
      for (const detail of body.details) {
        if (detail.id) {
          // atualiza existente
          await prisma.appointmentDetail.update({
            where: { id: detail.id },
            data: { service: detail.service, status: detail.status },
          });
        } else {
          // cria novo
          await prisma.appointmentDetail.create({
            data: { appointmentId, service: detail.service, status: detail.status },
          });
        }
      }
    }

    const updatedAppointment = await prisma.appointmentMaster.findUnique({
      where: { id: appointmentId },
      include: { details: true },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao atualizar agendamento" }, { status: 500 });
  }
}

// DELETE /api/appointments/:id → deletar master + detalhes (cascade)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const appointmentId = Number(params.id);

    // deletar detalhes primeiro (opcional, se cascade não estiver ativo)
    await prisma.appointmentDetail.deleteMany({ where: { appointmentId } });

    // deletar master
    await prisma.appointmentMaster.delete({ where: { id: appointmentId } });

    return NextResponse.json({ message: "Agendamento deletado" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao deletar agendamento" }, { status: 500 });
  }
}
