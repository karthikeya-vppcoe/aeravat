import type { NextApiRequest, NextApiResponse } from "next";
import { scrapeHackathons } from "@/app/modules/hackathon/scrapeHackathons";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const hackathons = await scrapeHackathons();
    res.status(200).json(hackathons);
  } catch (error) {
    console.error("Error scraping hackathons:", error);
    res.status(500).json({ error: "Failed to scrape hackathons" });
  }
}
