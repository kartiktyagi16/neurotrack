const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))

async function generateAI(prompt) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an API. Always return ONLY valid JSON. No explanation, no markdown."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    })
  })

  const data = await response.json()

  if (!data.choices || !data.choices.length) {
    throw new Error("Invalid AI response: " + JSON.stringify(data))
  }

  let content = data.choices[0].message.content

  content = content.replace(/```json/g, "").replace(/```/g, "").trim()

  return content
}

module.exports = generateAI