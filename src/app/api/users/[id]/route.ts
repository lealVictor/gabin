// src/app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Tipos seguros
type UserFromPrisma = Awaited<ReturnType<typeof prisma.user.findUnique>>;
type UserWithoutPassword = Omit<UserFromPrisma, "password">;

// GET /api/users/:id → detalhes
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = Number(params.id);
  if (isNaN(userId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        employments: { include: { client: true } },
        ownedCompanies: true,
      },
    });

    if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

    const { password, ...userWithoutPassword }: UserWithoutPassword = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao buscar usuário" }, { status: 500 });
  }
}

// PUT /api/users/:id → atualizar
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = Number(params.id);
  if (isNaN(userId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  try {
    const body = await req.json();

    const dataToUpdate: Partial<{ name: string; email: string; phone?: string; password?: string }> = {};
    if (body.name) dataToUpdate.name = body.name;
    if (body.email) dataToUpdate.email = body.email;
    if (body.phone) dataToUpdate.phone = body.phone;
    if (body.password) dataToUpdate.password = body.password;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      include: {
        employments: { include: { client: true } },
        ownedCompanies: true,
      },
    });

    const { password, ...userWithoutPassword }: UserWithoutPassword = updatedUser;
    return NextResponse.json(userWithoutPassword);
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 });
    if (error.code === "P2025") return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 });
  }
}

// DELETE /api/users/:id → deletar
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = Number(params.id);
  if (isNaN(userId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  try {
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ message: "Usuário deletado" });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2025") return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    return NextResponse.json({ error: "Erro ao deletar usuário" }, { status: 500 });
  }
}
