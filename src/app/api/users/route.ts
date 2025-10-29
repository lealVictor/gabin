import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Tipos seguros
type UserFromPrisma = Awaited<ReturnType<typeof prisma.user.findMany>>[number];
type UserWithoutPassword = Omit<UserFromPrisma, "password">;

// GET /api/users → lista todos os usuários
export async function GET() {
  try {
    const users = await prisma.user.findMany();

  const usersWithoutPassword: UserWithoutPassword[] = users.map((user: UserFromPrisma) => {
    const { password, ...rest } = user; // agora TypeScript sabe que password existe
    return rest;
  });


    return NextResponse.json(usersWithoutPassword);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 });
  }
}

// POST /api/users → cria um novo usuário
export async function POST(req: NextRequest) {
  try {
    const body: {
      name: string;
      email: string;
      phone?: string;
      password: string;
    } = await req.json();

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
        ownedCompanies: true,
      },
    });

    const { password, ...userWithoutPassword }: UserWithoutPassword = newUser as UserFromPrisma;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 });
  }
}
