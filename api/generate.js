export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const fullPrompt = `Create a 1000x1000 PNG of a Ghost character based on the uploaded base image, styled as: ${prompt}. Keep the same pose, face, and vibe. Flat cel-shade art. Transparent background.`;

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: fullPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return res.status(response.status).json({ error: error.error?.message || 'Failed to generate image' });
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;

    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
