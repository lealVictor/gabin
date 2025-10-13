import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const plan = await prisma.plan.findUnique({
      where: { id: Number(params.id) },
      include: { subscriptions: true } // opcional
    });
    if (!plan) return NextResponse.json({ error: "Plano não encontrado" }, { status: 404 });
    return NextResponse.json(plan);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao buscar plano" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await prisma.plan.update({
      where: { id: Number(params.id) },
      data: {
        name: body.name,
        type: body.type,
        price: body.price,
        limits: body.limits
      }
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao atualizar plano" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.plan.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ message: "Plano deletado" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao deletar plano" }, { status: 500 });
  }
}
