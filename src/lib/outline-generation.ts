'use server'

import { GoogleGenAI } from '@google/genai'

import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';



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

const prompt = `You are a professional document architect. Given the document type: "${documentType}" and the central concept: "${basicIdea}", generate a structured outline in **PURE JSON format** (no extra explanations, no markdown, no wrapping text).

### 🔒 OUTPUT FORMAT (STRICTLY REQUIRED):
Output should be a JSON array like this:
[
  {"id":"1","title":"Section Title","content":"Brief explanation of what this section should include or discuss"}
]

### 📌 GENERAL RULES
- DO NOT include "Section 1", "Step A", or numbering in the title.
- Title should be meaningful and specific (e.g., "Background Study" not "Section 1").
- Content must describe what the section should contain (purpose, expected writing, scope).
- The output should include **3 to 6 sections only.**
- Do **not** include boilerplate sections like Cover Page, Appendix, or TOC unless essential.
- Ensure each section contributes meaningfully to the document's purpose.

### 📄 DOCUMENT TYPE-SPECIFIC RULES:

**INVOICE**
- Must include: vendor and client details, line items, calculations (subtotal, tax, total), payment terms.

**WORD DOC**
- Typical sections: Title Page, Executive Summary, Body Content (with headings), and optional Appendices.

**ASSIGNMENT**
- Must include: Introduction (background), Research (literature/methods), Analysis (interpretation), Conclusion (key takeaways).
- Prefer real content over placeholders.
- Include what each section should *actually contain*, not just labels.

**REPORT**
- Should include: Executive Summary (1-paragraph summary), Background, Findings (evidence/data), Discussion, Recommendations.

### ✅ EXAMPLE OUTPUTS

Assignment (about Climate Change):
[
  {"id":"1","title":"Introduction","content":"Overview of climate change, importance, and purpose of the assignment"},
  {"id":"2","title":"Research","content":"Literature review of past studies, sources of climate data"},
  {"id":"3","title":"Analysis","content":"Interpreting patterns, data-driven insights"},
  {"id":"4","title":"Conclusion","content":"Summarize insights, discuss implications, possible future actions"}
]

Invoice:
[
  {"id":"1","title":"Header","content":"Details of vendor and client (names, addresses, invoice number, date)"},
  {"id":"2","title":"Line Items","content":"List of products or services, unit prices, quantities"},
  {"id":"3","title":"Totals","content":"Subtotal, tax, discounts, and final total"},
  {"id":"4","title":"Payment Details","content":"Bank account, payment due date, terms and conditions"}
]

### 🚀 INSTRUCTION
Now generate the structured JSON outline for the following:
Document Type: ${documentType}
Topic: "${basicIdea}"`;




  // const response = await ai.models.generateContent({
  //   model: 'gemini-2.0-flash',
  //   contents: [{ role: 'user', parts: [{ text: prompt }] }],
  // })

  
const { text } = await generateText({
  model: groq('llama-3.3-70b-versatile'),
  prompt:prompt,
});

  const response=text
  console.log(response)
  let rawText =response!
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

