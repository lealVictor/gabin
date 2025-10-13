import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/workspaces
export async function GET() {
  try {
    const workspaces = await prisma.workspace.findMany({
      include: { 
        calendars: true, 
        subscriptions: true, 
        owners: true // inclui os donos
      },
    });
    return NextResponse.json(workspaces);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao buscar workspace" }, { status: 500 });
  }
}

// POST /api/workspaces
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.friendlyUrl || !body.userId) {
      return NextResponse.json(
        { error: "Nome, friendlyUrl e userId são obrigatórios" },
        { status: 400 }
      );
    }

    const name = body.name.toString().trim();
    const friendlyUrl = body.friendlyUrl.toString().trim().toLowerCase().replace(/\s+/g, "-");

    // Valida duplicados: name ou friendlyUrl
    const existingWorkspace = await prisma.workspace.findFirst({
      where: {
        OR: [
          { name },
          { friendlyUrl }
        ]
      }
    });
    if (existingWorkspace) {
      if (existingWorkspace.name === name) {
        return NextResponse.json({ error: "Nome já existe" }, { status: 400 });
      } else {
        return NextResponse.json({ error: "friendlyUrl já existe" }, { status: 400 });
      }
    }

    const workspace = await prisma.workspace.create({
      data: {
        name,
        logo: body.logo || null,
        color: body.color || null,
        friendlyUrl,
        owners: { connect: [{ id: Number(body.userId) }] }
      },
      include: { owners: true } // retorna os donos junto
    });

    return NextResponse.json(workspace, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao criar workspace" }, { status: 500 });
  }
}

// PUT /api/workspaces/:id
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
      include: { owners: true } // retorna donos atualizado
    });
    return NextResponse.json(updatedWorkspace);
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "friendlyUrl já existe" }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao atualizar workspace" }, { status: 500 });
  }
}

// DELETE /api/workspaces/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.workspace.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ message: "Workspace deletado" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao deletar workspace" }, { status: 500 });
  }
}
