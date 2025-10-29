// app/api/tickets/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { titulo, descricao, categoria, prioridade } = body;

    if (!titulo || !descricao) {
      return NextResponse.json(
        { error: "Título e descrição são obrigatórios" },
        { status: 400 }
      );
    }

    // tenta pegar o usuário logado
    let userId: number | null = null;
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      userId = Number(session.user.id);
    }

    const ticket = await prisma.ticket.create({
      data: {
        titulo,
        descricao,
        categoria: categoria || "Geral",
        prioridade: prioridade || "Normal",
        userId: userId || undefined, // só insere se tiver logado
      },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao criar ticket" }, { status: 500 });
  }
}

// opcional: GET para listar tickets
export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tickets);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao buscar tickets" }, { status: 500 });
  }
}
