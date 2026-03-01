import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const listTargets = async (_req: Request, res: Response) => {
  try {
    const targets = await prisma.target.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json(targets);
  } catch (err) {
    console.error("List targets error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const createTarget = async (req: Request, res: Response) => {
  const { name, baseUrl, description } = req.body as {
    name?: string;
    baseUrl?: string;
    description?: string;
  };

  if (!name || !baseUrl) {
    return res.status(400).json({ error: "name and baseUrl are required" });
  }

  let normalizedUrl: string;
  try {
    normalizedUrl = new URL(baseUrl).toString().replace(/\/$/, "");
  } catch {
    return res.status(400).json({ error: "baseUrl must be a valid URL" });
  }

  try {
    const target = await prisma.target.create({
      data: {
        name: name.trim(),
        baseUrl: normalizedUrl,
        description: description?.trim() || null,
      },
    });
    return res.status(201).json(target);
  } catch (err: any) {
    if (err?.code === "P2002") {
      return res.status(409).json({ error: "A target with this URL already exists" });
    }
    console.error("Create target error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
