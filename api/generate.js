// /api/generate.js
import OpenAI from "openai";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OpenAI API key not configured" });
  }

  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const client = new OpenAI({ apiKey });

    // Load base ghost + mask from /public
    const baseImagePath = path.join(process.cwd(), "public", "base.png");
    const maskImagePath = path.join(process.cwd(), "public", "mask.png");

    const baseStream = fs.createReadStream(baseImagePath);
    const maskStream = fs.createReadStream(maskImagePath);

    // Strong instruction: do NOT change ghost, only add traits
    const fullPrompt = `
      Do NOT alter the ghost's shape, eyes, pose, or art style.
      Only add the following costume or traits on top: ${prompt}.
      Flat 2D style, no shading changes, transparent background.
    `;

    const response = await client.images.edits({
      model: "gpt-image-1",
      image: baseStream,
      mask: maskStream,
      prompt: fullPrompt,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const b64 = response.data?.[0]?.b64_json;
    if (!b64) {
      return res.status(502).json({ error: "No image returned" });
    }

    return res.status(200).json({ imageBase64: b64 });
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    return res.status(500).json({
      error: err.response?.data?.error?.message || "Failed to generate image",
    });
  }
}
