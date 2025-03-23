import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const profiles = await prisma.studentprofile_studentprofile.findMany();
    return res.status(200).json(profiles);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Failed to fetch profiles" });
  }
}





