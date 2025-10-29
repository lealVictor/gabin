import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const config = {
  api: { bodyParser: false }, // importante para FormData
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Campos do formulário
    const assessorId = formData.get("assessorId")?.toString();
    const descricao = formData.get("descricao")?.toString() ?? "";
    const meta = formData.get("meta")?.toString() ?? "";
    const cep = formData.get("cep")?.toString() ?? "";
    const numero = formData.get("numero")?.toString() ?? "";
    const logradouro = formData.get("logradouro")?.toString() ?? "";
    const bairro = formData.get("bairro")?.toString() ?? "";
    const cidade = formData.get("cidade")?.toString() ?? "";
    const uf = formData.get("uf")?.toString() ?? "";
    const lead_name = formData.get("lead_name")?.toString();
    const lead_whats = formData.get("lead_whats")?.toString();

    if (!assessorId) return NextResponse.json({ error: "assessorId é obrigatório" }, { status: 400 });

    // Processar arquivo (opcional)
    let attachmentPath: string | null = null;
    const file = formData.get("attachment") as File | null;
    if (file) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const fileName = `${Date.now()}_${file.name}`;
      const filePath = path.join(uploadsDir, fileName);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(filePath, buffer);

      // Salva caminho relativo para servir via /uploads/filename
      attachmentPath = `/uploads/${fileName}`;
    }

    const userConnect = { connect: { id: assessorId } };
    const leadConnect = lead_name && lead_whats ? {
      create: { lead_name, lead_whats, tag: "GERAL" }
    } : undefined;

    const task = await prisma.task.create({
      data: {
        title: descricao.substring(0, 50),
        description: descricao,
        status: "IN_PROGRESS",
        meta,
        cep,
        numero,
        logradouro,
        bairro,
        cidade,
        uf,
        attachment: attachmentPath,
        user: userConnect,
        lead: leadConnect,
      },
      include: { user: true, lead: true },
    });

    return NextResponse.json(task);
  } catch (err: any) {
    console.error("🔥 Erro ao criar task:", err);
    return NextResponse.json({ error: err.message || "Erro desconhecido" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get("status");

    const tasks = await prisma.task.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: "desc" },
      include: { user: true, lead: true },
    });

    return NextResponse.json(tasks);
  } catch (err) {
    console.error("❌ Erro no GET /api/tasks:", err);
    return NextResponse.json({ error: "Erro ao buscar tasks" }, { status: 500 });
  }
}
