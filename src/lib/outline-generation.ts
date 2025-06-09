'use server'

import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

export async function generateOutlineServerAction({
  documentType,
  basicIdea,
  images,
}: {
  documentType: string
  basicIdea: string
  images: { position: string }[]
}) {

 const prompt = `You are a professional document architect. Given document type: "${documentType}" and core concept: "${basicIdea}", generate a structured outline in PURE JSON format (no additional text or explanations).

### REQUIREMENTS
1. STRICTLY OUTPUT ONLY THIS JSON FORMAT:
[{"id":"1","title":"Section","content":"Description"}]

2. DOCUMENT-SPECIFIC RULES:
- INVOICE: Must include vendor/client info, itemized list, totals
- WORD DOC: Standard sections (cover, TOC, body, appendix)
- ASSIGNMENT: Introduction, research, analysis, conclusion
- REPORT: Exec summary, findings, recommendations

3. CONTROLS:
- 3-6 sections only
- Titles: no "Section 1" prefixes,actionable
- Content: word descriptions
- Dont add  Cover Page,appendix and table of content section  you are required to add important topic related to topic

### EXAMPLE OUTPUTS:
Invoice:
[{"id":"1","title":"Header","content":"Company and client information"},{"id":"2","title":"Line Items","content":"Detailed products/services list"}]

Assignment:
[{"id":"1","title":"Research Question","content":"States the core problem"},{"id":"2","title":"Methodology","content":"Explains research approach"}]

NOW GENERATE FOR: ${documentType} about "${basicIdea}"`;



  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  })

  console.log(response.text)
  let rawText =response.text!
  let outline;
  try {
   outline = JSON.parse(rawText)
 
} catch (err) {
  rawText = rawText.replace(/^```json/, '').replace(/```$/, '').trim()
  outline = JSON.parse(rawText)
}


  outline = outline.map((section: any) => {
    const sectionKey = section.title.toLowerCase().replace(/[^a-z0-9]/g, '-')
    const sectionImages = images.filter((img) => {
      return (
        img.position === sectionKey ||
        (img.position === 'introduction' && section.title.toLowerCase().includes('introduction')) ||
        (img.position === 'main-content' && section.title.toLowerCase().includes('main')) ||
        (img.position === 'supporting-details' && section.title.toLowerCase().includes('supporting')) ||
        (img.position === 'conclusion' && section.title.toLowerCase().includes('conclusion'))
      )
    })

    return {
      ...section,
      hasImages: sectionImages.length > 0,
      imageCount: sectionImages.length,
      content:
        sectionImages.length > 0
          ? `${section.content} (${sectionImages.length} image${sectionImages.length > 1 ? 's' : ''} included)`
          : section.content,
    }
  })

  return outline
}
