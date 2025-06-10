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
  {"id":"1","title":"Section Title","content":"Exactly what should be written in this section, in specific terms"}
]

### 📌 OUTPUT RULES (STRICT ENFORCEMENT):
- Do NOT write "Section 1", "Step A", or any kind of numbering in the title.
- Titles must be **descriptive, original, and specific to the document and topic**.
- Content must describe what **must actually be written** in this section, with examples or expected ideas.
- Avoid placeholder content like "write introduction here"; instead, explain **what kind of introduction**, what **key points** to address, and **how it connects** to the rest.
- Output **must include 6 to 10 sections** only.
- DO NOT include Cover Page, TOC, Appendix, or other boilerplate sections unless absolutely essential to the type and topic.

### 📄 DOCUMENT TYPE-SPECIFIC RULES:

**INVOICE**
- Include specific invoice sections: vendor/client info, detailed line items, pricing breakdown, and clear payment instructions.

**WORD DOC**
- May include: Title Page (with what info), Executive Summary (what should it summarize), Main Body (with sub-topics), Conclusion or Action Plan.
- Focus each section around a real function. No fluff.

**ASSIGNMENT**
- Must include: Introduction (set context, define terms), Research (citations, sources, previous work), Analysis (personal findings, data, interpretation), Conclusion (summarize with impact).
- Specify what should be written under each section **specific to the topic**.

**REPORT**
- Include: Executive Summary (1 paragraph summary), Background (context + problem), Findings (actual data or evidence), Discussion (interpretations, implications), Recommendations (next steps).

### ✅ EXAMPLES

Assignment on Climate Change:
[
  {"id":"1","title":"Introduction","content":"Define climate change in scientific terms, explain its urgency and why it matters globally. Introduce the scope of the assignment."},
  {"id":"2","title":"Literature Review","content":"Summarize 3-5 credible studies on climate data trends, highlight agreements or contradictions between them."},
  {"id":"3","title":"Data Analysis","content":"Present your own interpretation of temperature rise data over 50 years, highlight patterns or anomalies using graphs."},
  {"id":"4","title":"Conclusion and Implications","content":"Summarize the evidence, state how it supports your thesis, and propose realistic actions for policymakers or individuals."}
]

Invoice:
[
  {"id":"1","title":"Invoice Header","content":"List the vendor name, address, contact info, client name, invoice date, and unique invoice number."},
  {"id":"2","title":"Billed Services","content":"Itemized list with clear service descriptions (e.g., 'Web Design – 5 pages'), quantity, unit cost, and line totals."},
  {"id":"3","title":"Financial Summary","content":"Show subtotal, tax breakdown, discounts (if any), and final total in bold."},
  {"id":"4","title":"Payment Terms","content":"State the payment method, bank details (if needed), due date, and penalties for late payments."}
]

### 🚀 INSTRUCTION
Now generate the structured JSON outline for the following:
`




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

