import { FailedResponse } from '../types/responseStatus'
import { returnError } from './responseErrorHandler'
import { ProductAIResponse } from '../types/products'

export const extractJSON = (responseContent: string): ProductAIResponse[] | FailedResponse => {
  if (!responseContent) return returnError('No text in response', 404)

  // Attempt to extract JSON from OpenAI-style response
  const jsonMatch: RegExpMatchArray | null = responseContent.match(/```json\n([\s\S]+?)\n```/)
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1]) as ProductAIResponse[]
    } catch (error: unknown) {
      return returnError(`Error parsing OpenAI JSON: ${error}`)
    }
  }

  // Attempt to extract JSON from raw string format
  try {
    return JSON.parse(responseContent) as ProductAIResponse[]
  } catch (error: unknown) {
    return returnError(`Error parsing raw JSON: ${error}`)
  }
}

export const handleOpenAIResponse = (response: any) => {
  try {
    const rawContent = response.data.choices?.[0]?.message?.content || ''
    return extractJSON(rawContent) as FailedResponse | ProductAIResponse[]
  } catch (error: any) {
    return returnError(`Error fetching OpenAI API response: ${error.message}`)
  }
}
