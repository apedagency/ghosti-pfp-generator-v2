// /api/generate.js
import OpenAI from "openai";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: true,
  },
};

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

    // Paths to base ghost and mask (512x512)
    const baseImagePath = path.join(process.cwd(), "public", "base.png");
    const maskImagePath = path.join(process.cwd(), "public", "mask.png");

    // Ensure both exist
    if (!fs.existsSync(baseImagePath) || !fs.existsSync(maskImagePath)) {
      return res.status(500).json({ error: "Base or mask image not found" });
    }

    const baseStream = fs.createReadStream(baseImagePath);
    const maskStream = fs.createReadStream(maskImagePath);

    // Strong prompt: don’t change ghost, only add allowed traits
    const fullPrompt = `
      Do NOT modify the ghost's body, pose, face, outline, or style.
      Only draw/add traits inside the transparent mask area.
      The trait to add: ${prompt}.
      The ghost must remain pixel-perfect identical.
      Output must be flat 2D style, transparent background.
    `.trim();

    // Generate edited image
    const response = await client.images.createEdit({
      model: "gpt-image-1",
      image: baseStream,
      mask: maskStream,
      prompt: fullPrompt,
      size: "512x512",
      response_format: "b64_json",
    });

    const b64 = response.data?.[0]?.b64_json;
    if (!b64) {
      return res.status(502).json({ error: "No image returned from OpenAI" });
    }

    // Return Base64 for direct display in frontend
    return res.status(200).json({ imageBase64: b64 });
  } catch (err) {
    console.error("Error generating image:", err.response?.data || err.message);
    return res.status(500).json({
      error: err.response?.data?.error?.message || "Failed to generate image",
    });
  }
}
