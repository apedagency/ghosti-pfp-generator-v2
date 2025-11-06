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

    // Paths to base image and mask image
    const baseImagePath = path.join(process.cwd(), "public", "base.png");
    const maskImagePath = path.join(process.cwd(), "public", "mask.png");

    const baseStream = fs.createReadStream(baseImagePath);
    const maskStream = fs.createReadStream(maskImagePath);

    // Prompt: strong instruction to preserve ghost, only add traits
    const fullPrompt = `
      You MUST NOT modify the ghost's body, shape, outline, or style. 
      Add the following trait(s) ONLY in the transparent areas of the mask: ${prompt}.
      The ghost must remain 100% visually identical. Only add accessories, headwear, props, etc.
      Output must be flat 2D vector style, simple colors, transparent background, PNG format.
    `;

    const response = await client.images.edits({
      model: "gpt-image-1",
      image: baseStream,
      mask: maskStream, // mask restricts where AI can draw
      prompt: fullPrompt,
      size: "512x512", // match your base resolution
      response_format: "b64_json",
    });

    const b64 = response.data?.[0]?.b64_json;
    if (!b64) {
      return res.status(502).json({ error: "No image returned" });
    }

    return res.status(200).json({ imageBase64: b64 });
  } catch (err) {
    console.error("Error generating image:", err.response?.data || err.message);
    return res.status(500).json({
      error: err.response?.data?.error?.message || "Failed to generate image",
    });
  }
}
