"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateSectionContent(
  sectionTitle: string,
  sectionDescription: string,
  documentType: string,
  mainIdea: string,
) {
  try {
    // Change to use the flash preview model instead of pro
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" })

    console.log("mainidea= ",mainIdea)
    const prompt = `
You are a professional document writer. Generate detailed, academic-quality content for a ${documentType} section.

Section Title: ${sectionTitle}
Section Description: ${sectionDescription}
Document Main Idea: ${mainIdea}
Document Type: ${documentType}

Requirements:
- Write 2-3 well-structured paragraphs (150-250 words)
- Use professional, academic language appropriate for ${documentType}
- Make it specific to the main idea: ${mainIdea}
- Include relevant details and insights
- Ensure content flows logically
- No placeholder text or Lorem ipsum

Generate only the content, no additional formatting or explanations.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Error generating content:", error)

    // Provide a fallback content that's relevant to the section and topic
    let fallbackContent = "Error generating content"

    
    return fallbackContent
  }
}
