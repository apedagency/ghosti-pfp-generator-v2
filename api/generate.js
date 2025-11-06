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

    const imgPath = path.join(process.cwd(), "public", "base.jpg");
    const imgStream = fs.createReadStream(imgPath);

    const result = await client.images.variations({
      image: imgStream,
      n: 1,
      size: "1024x1024",
      prompt: `Apply the following style to this ghost character: ${prompt}. Keep the same pose and structure.`,
      response_format: "b64_json",
    });

    const b64 = result.data?.[0]?.b64_json;
    if (!b64) {
      return res.status(502).json({ error: "No image returned from OpenAI" });
    }

    return res.status(200).json({ imageBase64: b64 });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    return res.status(500).json({
      error: error.response?.data?.error?.message || "Failed to generate image",
    });
  }
}
