import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const plan = await prisma.plan.findUnique({
    where: { id: Number(params.id) },
    include: { subscriptions: true } // só se quiser incluir assinaturas
  });
  return NextResponse.json(plan);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updated = await prisma.plan.update({
    where: { id: Number(params.id) },
    data: { 
      name: body.name,
      type: body.type,
      price: body.price,
      limits: body.limits
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.plan.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ message: "Plano deletado" });
}
