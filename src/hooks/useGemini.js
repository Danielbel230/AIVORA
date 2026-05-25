import { useState } from 'react'
import { buildPrompt } from '../utils/geminiPrompt'

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

export function useGemini() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function generarPerfume(nombre, emocion, respuestas, perfil) {
    setLoading(true)
    setError(null)

    const prompt = buildPrompt(nombre, emocion, respuestas, perfil)

    try {
      const res = await fetch(OPENAI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0.9,
          max_tokens: 512,
          messages: [{ role: 'user', content: prompt }],
        })
      })

      if (!res.ok) throw new Error(`OpenAI HTTP ${res.status}`)

      const json = await res.json()
      const raw = json.choices?.[0]?.message?.content

      if (!raw) throw new Error('OpenAI: respuesta vacía')

      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      return JSON.parse(cleaned)
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { generarPerfume, loading, error }
}
