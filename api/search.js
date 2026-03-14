export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Basic rate limiting via request size
  const { query } = req.body;
  if (!query || typeof query !== "string" || query.length > 2000) {
    return res.status(400).json({ error: "Invalid query" });
  }

  const prompt = `You are a B2B business matchmaking AI for a platform called BridgeB2B. A business owner is looking for specific companies to partner with or buy from.

Based on this search query, generate 6 highly relevant fictional but realistic company matches with full details. Return ONLY valid JSON, no markdown, no explanation.

Search query: "${query}"

Return this exact JSON structure:
{
  "summary": "2-3 sentence AI analysis of what this business needs and why these matches are ideal",
  "companies": [
    {
      "name": "Company Name",
      "industry": "Industry / Sector",
      "size": "e.g. 12-50 employees",
      "location": "City, Province/State",
      "description": "2 sentence description of what this company does",
      "whyMatch": "1-2 sentences on exactly why this is a great match for the searcher",
      "tags": ["tag1", "tag2", "tag3"],
      "matchScore": 92,
      "contact": {
        "name": "Full Name",
        "role": "Job Title",
        "email": "email@company.com",
        "phone": "+1 (555) 000-0000",
        "website": "www.companyname.com",
        "linkedin": "linkedin.com/in/name"
      }
    }
  ]
}

Make the companies diverse in size and approach. Make contact info realistic but clearly fictional (use 555 numbers). Match score should be between 78-97. Tailor everything specifically to the query.`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 3000,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.json();
      console.error("Gemini API error:", err);
      return res.status(502).json({ error: "AI service error. Please try again." });
    }

    const data = await geminiRes.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Handler error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
