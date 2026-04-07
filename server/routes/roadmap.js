const express = require('express')
const router = express.Router()
const generateAI = require("../gemini")

router.post('/', async (req, res) => {
  try {
    const { goal, duration = 4 } = req.body

    if (!goal) {
      return res.status(400).json({ error: 'goal is required' })
    }

    const prompt = `
Create a detailed ${duration}-week roadmap for "${goal}".

Rules:
- Each week must have a clear title
- Include practical and actionable topics
- Progress from beginner → advanced
- Keep it realistic for students

Return ONLY JSON:
{
  "weeks": [
    {
      "week": 1,
      "title": "...",
      "topics": ["...", "..."]
    }
  ]
}
`

    const aiResponse = await generateAI(prompt)

    let parsed

    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)

      if (!jsonMatch) {
        throw new Error("No valid JSON found in AI response")
      }

      parsed = JSON.parse(jsonMatch[0])

    } catch (e) {
      console.error("Parsing error:", aiResponse)
      return res.status(500).json({ error: "Invalid AI response format" })
    }

    if (!parsed.weeks || !Array.isArray(parsed.weeks)) {
      return res.status(500).json({ error: "AI did not return valid roadmap" })
    }

    res.json({
      success: true,
      data: {
        goal,
        weeks: parsed.weeks,
        generatedAt: new Date().toISOString(),
      }
    })

  } catch (err) {
    console.error("Roadmap AI Error:", err)
    res.status(500).json({ error: 'Failed to generate roadmap' })
  }
})

module.exports = router