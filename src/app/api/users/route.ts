// src/app/api/users/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Tipo seguro baseado no retorno do Prisma
type UserWithRelations = Awaited<ReturnType<typeof prisma.user.findMany>>[number];

// GET /api/users → lista todos os usuários
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: { 
        employments: { include: { client: true } }, // empregos e clientes
        ownedCompanies: true,                        // empresas que o usuário possui
      },
    });

    // Remove a senha da resposta
    const usersWithoutPassword = users.map(({ password, ...rest }: UserWithRelations) => rest);

    return NextResponse.json(usersWithoutPassword);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 });
  }
}

// POST /api/users → cria um novo usuário
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Verifica se email já existe
    const existing = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (existing) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        password: body.password,
      },
      include: { 
        employments: { include: { client: true } }, 
        ownedCompanies: true 
      },
    });

    // Remove a senha antes de retornar
    const { password, ...userWithoutPassword }: UserWithRelations = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 });
  }
}
