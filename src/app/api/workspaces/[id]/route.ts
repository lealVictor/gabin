// src/app/api/workspaces/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/workspaces/:id → detalhes do workspace
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const workspace = await prisma.workspace.findUnique({
      where: { id: Number(params.id) },
      include: { calendars: true, subscriptions: true, owners: true },
    });
    if (!workspace) return NextResponse.json({ error: "Workspace não encontrado" }, { status: 404 });
    return NextResponse.json(workspace);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao buscar workspace" }, { status: 500 });
  }
}

// PUT /api/workspaces/:id → atualizar workspace
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updatedWorkspace = await prisma.workspace.update({
      where: { id: Number(params.id) },
      data: {
        name: body.name,
        logo: body.logo,
        color: body.color,
        friendlyUrl: body.friendlyUrl,
      },
      include: { owners: true } // retorna donos atualizados
    });
    return NextResponse.json(updatedWorkspace);
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "friendlyUrl já existe" }, { status: 400 });
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Workspace não encontrado" }, { status: 404 });
    }
    return NextResponse.json({ error: "Erro ao atualizar workspace" }, { status: 500 });
  }
}

// DELETE /api/workspaces/:id → deletar workspace
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.workspace.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ message: "Workspace deletado" });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Workspace não encontrado" }, { status: 404 });
    }
    return NextResponse.json({ error: "Erro ao deletar workspace" }, { status: 500 });
  }
}
