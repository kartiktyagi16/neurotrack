const express = require('express')
const router = express.Router()
const generateAI = require("../gemini")

router.post('/', async (req, res) => {
  console.log("QUIZ HIT:", req.body)

  try {
    const { topic, difficulty = 'medium', count = 5 } = req.body

    if (!topic) {
      return res.status(400).json({ error: 'topic is required' })
    }

    const prompt = `
Generate ${count} HIGH QUALITY ${difficulty}-level MCQs on "${topic}" for coding interviews.

STRICT RULES:
- Questions must be SPECIFIC and technical
- NO generic theory questions
- Focus on:
  - time complexity
  - algorithms
  - edge cases
  - real problem solving
- Each question must be unique and non-repetitive

Return ONLY JSON:
{
  "questions": [
    {
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "correctIndex": 0,
      "explanation": "..."
    }
  ]
}
`

    const aiResponse = await generateAI(prompt)

    console.log("AI RAW RESPONSE:", aiResponse)

    let parsed

    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)

      if (!jsonMatch) {
        throw new Error("Invalid JSON from AI")
      }

      parsed = JSON.parse(jsonMatch[0])

    } catch (e) {
      console.error("Parsing error:", aiResponse)
      return res.status(500).json({ error: "Invalid AI response format" })
    }

    if (!parsed || !parsed.questions || !Array.isArray(parsed.questions)) {
      console.error("Invalid structure:", parsed)
      return res.status(500).json({ error: "AI did not return valid questions" })
    }

    res.json({
      success: true,
      data: {
        topic,
        difficulty,
        questions: parsed.questions,
        generatedAt: new Date().toISOString(),
      }
    })

  } catch (err) {
    console.error("Quiz AI Error:", err)
    res.status(500).json({ error: 'Failed to generate quiz' })
  }
})

module.exports = router