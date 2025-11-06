// /api/generate.js
import OpenAI from "openai";
import fs from "fs";
import path from "path";

export const config = {
  api: { bodyParser: true }, // ensure body JSON is parsed
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

    // Path to your base image in /public
    const baseImagePath = path.join(process.cwd(), "public", "base.jpg");

    // Read the base image from the filesystem
    const baseImageStream = fs.createReadStream(baseImagePath);

    // Strong prompt to ensure pose/shape consistency
    const fullPrompt = `
      Use this as the primary ghost body. Keep shape, pose, eyes, silhouette exactly the same.
      Now apply this style: ${prompt}.
      Flat cel-shaded colors, clean lines. Transparent background. No realism or 3D rendering.
    `;

    // Call OpenAI Images API (GPT-Image-1) with image variation mode
    const apiResponse = await client.images.generate({
      model: "gpt-image-1",
      prompt: fullPrompt,
      image: baseImageStream,         // 👈 sends base ghost for foundation
      size: "1024x1024",
      response_format: "b64_json",
    });

    const b64 = apiResponse.data?.[0]?.b64_json;
    if (!b64) {
      return res.status(502).json({ error: "No image returned from OpenAI" });
    }

    // Return Base64 to frontend for instant preview
    return res.status(200).json({ imageBase64: b64 });
  } catch (error) {
    console.error("Error generating image:", error.response?.data || error.message);
    return res.status(500).json({
      error: error.response?.data?.error?.message || "Failed to generate image",
    });
  }
}
