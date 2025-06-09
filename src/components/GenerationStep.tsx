"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Download, MessageCircle, Send, ArrowLeft, RefreshCw, FileText, Save, X } from "lucide-react"
import type { AppState } from "@/app/page"
import { sendChatMessage } from "@/lib/action"
import { generateSectionContent } from "@/lib/content-gen"

interface GenerationStepProps {
  onPrev: () => void
  appState: AppState
  updateAppState: (updates: Partial<AppState>) => void
}

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

// Document templates with styling and structure


export default function GenerationStep({ onPrev, appState, updateAppState }: GenerationStepProps) {
 const DOCUMENT_TEMPLATES = {
  assignment: {
    header: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Assignment Document</title>
  <style>
    @page { 
      margin: 1in; 
      border: 2px solid #000;
      padding: 20px;
    }
    body { 
      font-family: 'Times New Roman', serif; 
      font-size: 12pt; 
      line-height: 1.6; 
      border: 1px solid #333;
      padding: 20px;
      margin: 0;
    }
    .header-page {
      text-align: center;
      page-break-after: always;
      border-bottom: 2px solid #000;
      padding-bottom: 30px;
      margin-bottom: 30px;
    }
    .university-logo {
      width: 120px;
      height: 120px;
      margin: 0 auto 20px;
      border: 2px solid #000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      background: #f5f5f5;
    }
    .assignment-details {
      margin: 30px 0;
      text-align: left;
      border: 1px solid #666;
      padding: 20px;
      background: #fafafa;
    }
    .detail-row {
      margin: 10px 0;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dotted #999;
      padding-bottom: 5px;
    }
    h1 { font-size: 18pt; font-weight: bold; margin: 20px 0; }
    h2 { font-size: 14pt; font-weight: bold; margin: 16px 0 8px; border-bottom: 1px solid #333; }
    h3 { font-size: 12pt; font-weight: bold; margin: 12px 0 6px; }
    .content-section {
      margin: 20px 0;
      padding: 15px;
      border-left: 3px solid #007acc;
    }
    .editable {
      min-height: 50px;
      padding: 10px;
      border: 1px dashed #ccc;
      cursor: text;
    }
    .editable:hover {
      background: #f9f9f9;
      border-color: #007acc;
    }
  </style>
</head>
<body>
  <div class="header-page">
    <div class="university-logo">
      [UNIVERSITY LOGO]
    </div>
    <h1>UNIVERSITY ASSIGNMENT</h1>
    <div class="assignment-details">
      <div class="detail-row">
        <span><strong>Student Name:</strong></span>
        <span contenteditable="true" style="border-bottom: 1px solid #000; min-width: 200px; display: inline-block;">${appState.documentData?.studentName || "[Enter Name]"}</span>
      </div>
      <div class="detail-row">
        <span><strong>Student ID:</strong></span>
        <span contenteditable="true" style="border-bottom: 1px solid #000; min-width: 200px; display: inline-block;">${appState.documentData?.studentId || "[Enter Student ID]"}</span>
      </div>
      <div class="detail-row">
        <span><strong>Course Code:</strong></span>
        <span contenteditable="true" style="border-bottom: 1px solid #000; min-width: 200px; display: inline-block;">${appState.documentData?.courseCode || "[Enter Course Code]"}</span>
      </div>
      <div class="detail-row">
        <span><strong>Course Name:</strong></span>
        <span contenteditable="true" style="border-bottom: 1px solid #000; min-width: 200px; display: inline-block;">${appState.documentData?.courseName || "[Enter Course Name]"}</span>
      </div>
      <div class="detail-row">
        <span><strong>Assignment Title:</strong></span>
        <span contenteditable="true" style="border-bottom: 1px solid #000; min-width: 200px; display: inline-block;">${appState.documentData?.assignmentTitle || "[Enter Assignment Title]"}</span>
      </div>
      <div class="detail-row">
        <span><strong>Topic:</strong></span>
        <span contenteditable="true" style="border-bottom: 1px solid #000; min-width: 200px; display: inline-block;">${appState.documentData?.topic || "[Enter Topic]"}</span>
      </div>
      <div class="detail-row">
        <span><strong>Due Date:</strong></span>
        <span contenteditable="true" style="border-bottom: 1px solid #000; min-width: 200px; display: inline-block;">${appState.documentData?.dueDate || "[Enter Due Date]"}</span>
      </div>
      <div class="detail-row">
        <span><strong>Instructor:</strong></span>
        <span contenteditable="true" style="border-bottom: 1px solid #000; min-width: 200px; display: inline-block;">${appState.documentData?.instructorName || "[Enter Instructor Name]"}</span>
      </div>
      ${
        appState.documentData?.wordCount
          ? `
      <div class="detail-row">
        <span><strong>Word Count:</strong></span>
        <span>${appState.documentData.wordCount} words</span>
      </div>
      `
          : ""
      }
    </div>
  </div>
`,
    footer: `
  <div style="margin-top: 50px; text-align: center; border-top: 1px solid #333; padding-top: 20px;">
    <p><em>This assignment was prepared as part of academic requirements.</em></p>
    <p><strong>Submitted on: ${new Date().toLocaleDateString()}</strong></p>
  </div>
</body>
</html>`,
  },
  report: {
    header: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Professional Report</title>
  <style>
    @page { margin: 1in; }
    body { font-family: 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; }
    .header-page { text-align: center; page-break-after: always; }
    h1 { font-size: 20pt; color: #2c3e50; }
    h2 { font-size: 14pt; color: #34495e; border-bottom: 2px solid #3498db; }
    .content-section { margin: 15px 0; }
  </style>
</head>
<body>
  <div class="header-page">
    <h1>PROFESSIONAL REPORT</h1>
    <p style="font-size: 14pt; margin: 30px 0;">Prepared by: [Author Name]</p>
    <p>Date: ${new Date().toLocaleDateString()}</p>
  </div>
`,
    footer: `</body></html>`,
  },
  proposal: {
    header: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Project Proposal</title>
  <style>
    @page { margin: 1in; }
    body { font-family: 'Calibri', sans-serif; font-size: 11pt; line-height: 1.4; }
    .header-page { text-align: center; page-break-after: always; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 50px; }
    h1 { font-size: 24pt; margin-bottom: 30px; }
    h2 { font-size: 16pt; color: #5d4e75; }
  </style>
</head>
<body>
  <div class="header-page">
    <h1>PROJECT PROPOSAL</h1>
    <p style="font-size: 16pt;">Submitted by: [Proposer Name]</p>
    <p>Date: ${new Date().toLocaleDateString()}</p>
  </div>
`,
    footer: `</body></html>`,
  },
}
  const [isGenerating, setIsGenerating] = useState(true)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hi! I'm here to help you refine your document. You can ask me to update specific sections or ask general questions about your document.",
      timestamp: new Date(),
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [imageDataUrls, setImageDataUrls] = useState<{ [key: string]: string }>({})
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationStatus, setGenerationStatus] = useState("Analyzing your outline...")

  // Convert images to base64 for embedding
  useEffect(() => {
    const convertImagesToBase64 = async () => {
      const dataUrls: { [key: string]: string } = {}

      for (const image of appState.images) {
        try {
          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")
          const img = new Image()

          await new Promise((resolve, reject) => {
            img.onload = () => {
              const maxWidth = 800
              const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
              canvas.width = img.width * ratio
              canvas.height = img.height * ratio

              ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
              dataUrls[image.id] = canvas.toDataURL("image/jpeg", 0.8)
              resolve(null)
            }
            img.onerror = reject
            img.crossOrigin = "anonymous"
            img.src = URL.createObjectURL(image.file)
          })
        } catch (error) {
          console.error("Error converting image:", error)
          dataUrls[image.id] = URL.createObjectURL(image.file)
        }
      }

      setImageDataUrls(dataUrls)
    }

    if (appState.images.length > 0) {
      convertImagesToBase64()
    }
  }, [appState.images])

  // Generate document using Gemini AI
  const generateDocumentWithAI = async () => {
    const template = DOCUMENT_TEMPLATES[appState.documentType as keyof typeof DOCUMENT_TEMPLATES]

    let documentContent = template?.header || `${appState.documentType?.replace("-", " ").toUpperCase()} DOCUMENT\n\n`

    // Add top images
    const topImages = appState.images.filter((img) => img.position === "top")
    if (topImages.length > 0) {
      documentContent += "=== DOCUMENT IMAGES ===\n"
      topImages.forEach((img) => {
        documentContent += `IMAGE:${img.id}:${img.file.name}:${img.description || "No description"}\n`
      })
      documentContent += "\n"
    }

    // Add executive summary using the topic from documentData
    const mainTopic = appState.documentData?.topic || appState.basicIdea || "the assigned topic"
    documentContent += `<div class="content-section"><h2>EXECUTIVE SUMMARY</h2>\n<div class="editable" data-section="executive-summary">This assignment explores ${mainTopic}, providing comprehensive analysis and insights into this important subject matter.</div></div>\n\n`

    // Add key points
    documentContent += `<div class="content-section"><h2>KEY POINTS</h2>\n<div class="editable" data-section="key-points">`
    appState.textPoints
      .filter((point) => point.trim())
      .forEach((point, index) => {
        documentContent += `${index + 1}. ${point}\n`
      })
    documentContent += `</div></div>\n\n`

    // Generate AI content for each section
    const totalSections = appState.outline.length
    for (let i = 0; i < appState.outline.length; i++) {
      const section = appState.outline[i]
      setGenerationProgress(Math.floor((i / totalSections) * 100))
      setGenerationStatus(`Generating content for "${section.title}" section...`)

      try {
        const aiContent = await generateSectionContent(
          section.title,
          section.content,
          appState.documentType || "document",
          appState.documentData?.topic || appState.basicIdea || "the assigned topic",
        )

        documentContent += `<div class="content-section"><h2>${section.title.toUpperCase()}</h2>\n`

        // Add images for this section
        const sectionImages = appState.images.filter((img) => {
          const sectionKey = section.title.toLowerCase().replace(/[^a-z0-9]/g, "-")
          return (
            img.position === sectionKey ||
            (img.position === "introduction" && section.title.toLowerCase().includes("introduction")) ||
            (img.position === "main-content" && section.title.toLowerCase().includes("main")) ||
            (img.position === "supporting-details" && section.title.toLowerCase().includes("supporting")) ||
            (img.position === "conclusion" && section.title.toLowerCase().includes("conclusion"))
          )
        })

        if (sectionImages.length > 0) {
          documentContent += "<h3>Section Images</h3>\n"
          sectionImages.forEach((img) => {
            documentContent += `IMAGE:${img.id}:${img.file.name}:${img.description || "No description provided"}\n`
          })
          documentContent += "\n"
        }

        documentContent += `<div class="editable" data-section="${section.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}">${aiContent}</div></div>\n\n`
      } catch (error) {
        console.error("Error generating AI content:", error)
        documentContent += `<div class="content-section"><h2>${section.title.toUpperCase()}</h2>\n<div class="editable" data-section="${section.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}">${section.content}\n\nThis section provides comprehensive coverage of ${section.title.toLowerCase()} as it relates to ${appState.basicIdea}.</div></div>\n\n`
      }
    }

    setGenerationProgress(90)
    setGenerationStatus("Finalizing document...")

    // Add requirements section if exists
    if (appState.documentData?.requirements && appState.documentData.requirements.some((req:any) => req.trim())) {
      documentContent += `<div class="content-section"><h2>ASSIGNMENT REQUIREMENTS</h2>\n<div class="editable" data-section="requirements">`
      appState.documentData.requirements
        .filter((req:any) => req.trim())
        .forEach((req:any, index:number) => {
          documentContent += `${index + 1}. ${req}\n`
        })
      documentContent += `</div></div>\n\n`
    }

    // Add sources section if exists
    if (appState.documentData?.sources && appState.documentData.sources.some((source:any) => source.trim())) {
      documentContent += `<div class="content-section"><h2>REFERENCES</h2>\n<div class="editable" data-section="references">`
      appState.documentData.sources
        .filter((source:any) => source.trim())
        .forEach((source:any, index:number) => {
          documentContent += `${index + 1}. ${source}\n`
        })
      documentContent += `</div></div>\n\n`
    }

    // Add bottom images
    const bottomImages = appState.images.filter((img) => img.position === "bottom")
    if (bottomImages.length > 0) {
      documentContent += "=== ADDITIONAL RESOURCES ===\n"
      bottomImages.forEach((img) => {
        documentContent += `IMAGE:${img.id}:${img.file.name}:${img.description || "No description"}\n`
      })
      documentContent += "\n"
    }

    // Add conclusion
    documentContent += `<div class="content-section"><h2>CONCLUSION</h2>\n<div class="editable" data-section="conclusion">`
    if (appState.documentType === "assignment") {
      documentContent += `This assignment has provided a comprehensive analysis of ${mainTopic}. Through detailed examination and critical evaluation, key insights have been developed that contribute to a deeper understanding of the subject matter. The research and analysis presented demonstrate thorough engagement with the topic and highlight important considerations for future study.`
    } else if (appState.documentType === "report") {
      documentContent += `This report presents comprehensive findings and actionable recommendations regarding ${mainTopic}. The analysis conducted provides stakeholders with the necessary information for informed decision-making and strategic planning moving forward.`
    } else {
      documentContent += `This document provides a thorough examination of ${mainTopic}, presenting well-researched insights and professional analysis that contributes valuable understanding to the field.`
    }
    documentContent += `</div></div>\n\n`

    documentContent +=
      template?.footer ||
      `\n---\nDocument generated by Docgent AI on ${new Date().toLocaleDateString()}\nProfessional Document Generation Platform`

    setGenerationProgress(100)
    return documentContent
  }

  useEffect(() => {
    // Generate document with AI
    const generateDocument = async () => {
      try {
        const aiDocument = await generateDocumentWithAI()
        updateAppState({ finalDocument: aiDocument })
        setIsGenerating(false)
      } catch (error) {
        console.error("Error generating document:", error)
        setIsGenerating(false)
      }
    }

    generateDocument()
  }, [appState.outline, appState.basicIdea, appState.documentType])

  // Process chatbot response and update document
  const processChatbotResponse = (response: string) => {
    const lines = response.trim().split("\n")
    const firstLine = lines[0].toLowerCase().trim()

    if (firstLine === "update" && lines.length >= 3) {
      // Extract heading and content
      const heading = lines[1].trim()
      const updatedContent = lines.slice(2).join("\n").trim()

      // Update the document
      if (appState.finalDocument) {
        let updatedDocument = appState.finalDocument

        // Try to find and update the section
        const sectionRegex = new RegExp(
          `(<h2>${heading.toUpperCase()}</h2>\\s*<div class="editable"[^>]*>)([^<]*)(</div>)`,
          "gi",
        )
        const altSectionRegex = new RegExp(
          `(${heading.toUpperCase()}\\s*\\n)([^\\n]*(?:\\n(?!\\w+\\s*\\n)[^\\n]*)*)(\\n|$)`,
          "gi",
        )

        if (sectionRegex.test(updatedDocument)) {
          updatedDocument = updatedDocument.replace(sectionRegex, `$1${updatedContent}$3`)
        } else if (altSectionRegex.test(updatedDocument)) {
          updatedDocument = updatedDocument.replace(altSectionRegex, `$1${updatedContent}$3`)
        } else {
          // Section not found, add error message
          const errorMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            type: "ai",
            content: `❌ Could not find the "${heading}" section in your document. Available sections: ${extractSectionNames(appState.finalDocument).join(", ")}`,
            timestamp: new Date(),
          }
          setChatMessages((prev) => [...prev, errorMessage])
          return
        }

        updateAppState({ finalDocument: updatedDocument })

        // Add confirmation message
        const confirmationMessage: ChatMessage = {
          id: (Date.now() + 2).toString(),
          type: "ai",
          content: `✅ Successfully updated the "${heading}" section of your document!`,
          timestamp: new Date(),
        }
        setChatMessages((prev) => [...prev, confirmationMessage])
      }
    } else if (firstLine === "general") {
      // Handle general response
      const generalResponse = lines.slice(1).join("\n").trim()
      if (generalResponse) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: generalResponse,
          timestamp: new Date(),
        }
        setChatMessages((prev) => [...prev, aiMessage])
      } else {
        // Fallback for empty general response
        const fallbackMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content:
            "I understand your question. Could you please be more specific about what you'd like to know or change in your document?",
          timestamp: new Date(),
        }
        setChatMessages((prev) => [...prev, fallbackMessage])
      }
    } else {
      // Fallback - treat as general response
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response || "I'm here to help! Please let me know what changes you'd like to make to your document.",
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, aiMessage])
    }
  }

  // Extract section names from document for error messages
  const extractSectionNames = (document: string): string[] => {
    const sections: string[] = []
    const h2Regex = /<h2>([^<]+)<\/h2>/gi
    const plainRegex = /^([A-Z\s]+)$/gm

    let match
    while ((match = h2Regex.exec(document)) !== null) {
      sections.push(match[1])
    }
    while ((match = plainRegex.exec(document)) !== null) {
      if (match[1].length > 3 && match[1].length < 50) {
        sections.push(match[1])
      }
    }

    return [...new Set(sections)]
  }

  const sendMessage = async () => {
    if (!chatInput.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: chatInput,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")

    try {
      const res = await sendChatMessage(
        chatInput,
        appState.finalDocument!,
        appState.documentData?.topic || appState.basicIdea,
      )
      processChatbotResponse(res)
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, errorMessage])
    }
  }

  // Handle inline editing
  const startEditing = (sectionId: string, currentContent: string) => {
    setEditingSection(sectionId)
    setEditContent(currentContent)
  }

  const saveEdit = () => {
    if (editingSection && appState.finalDocument) {
      const updatedDocument = appState.finalDocument.replace(
        new RegExp(`(<div class="editable" data-section="${editingSection}">)([^<]*)(</div>)`, "gi"),
        `$1${editContent}$3`,
      )
      updateAppState({ finalDocument: updatedDocument })
      setEditingSection(null)
      setEditContent("")
    }
  }

  const cancelEdit = () => {
    setEditingSection(null)
    setEditContent("")
  }

  const downloadDocument = () => {
    if (appState.finalDocument) {
      let wordContent = appState.finalDocument

      // Process images
      const lines = appState.finalDocument.split("\n")
      for (const line of lines) {
        if (line.startsWith("IMAGE:")) {
          const parts = line.split(":")
          if (parts.length >= 4) {
            const imageId = parts[1]
            const filename = parts[2]
            const description = parts.slice(3).join(":")

            if (imageDataUrls[imageId]) {
              const imageHtml = `
                <div style="text-align: center; margin: 20px 0;">
                  <img src="${imageDataUrls[imageId]}" style="max-width: 100%; height: auto; border: 1px solid #ddd; padding: 5px;" alt="${filename}" />
                  <div style="font-style: italic; font-size: 10pt; color: #666; text-align: center; margin-top: 5px;">${filename}${description ? ` - ${description}` : ""}</div>
                </div>
              `
              wordContent = wordContent.replace(line, imageHtml)
            }
          }
        }
      }

      const blob = new Blob([wordContent], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${appState.documentType}-document.doc`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  if (isGenerating) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <RefreshCw className="w-10 h-10 text-white" />
              </motion.div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Generating your document with AI...</h2>
            <p className="text-slate-400 mb-6">
              Using Gemini AI to create professional content for your {appState.documentType}
            </p>

            {/* Progress bar */}
            <div className="w-full bg-slate-700 rounded-full h-2.5 mb-6 max-w-md mx-auto">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
              ></div>
            </div>

            <div className="text-slate-300 mb-8">{generationStatus}</div>

            <div className="max-w-md mx-auto space-y-3">
              {[
                "Analyzing your outline...",
                "Generating AI content...",
                "Processing images...",
                "Applying templates...",
                "Finalizing document...",
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.8 }}
                  className="flex items-center space-x-3 text-slate-300"
                >
                  <div
                    className={`w-2 h-2 ${generationProgress >= (index + 1) * 20 ? "bg-green-400" : "bg-blue-400"} rounded-full`}
                  />
                  <span>{step}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Your AI-generated document is ready!</h2>
        <p className="text-slate-400">Review, edit, and refine your professional {appState.documentType}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Document Preview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 h-[600px] overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">Document Preview (Click to Edit)</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={downloadDocument}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 h-full overflow-y-auto">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: appState.finalDocument || "" }}
                onClick={(e) => {
                  const target = e.target as HTMLElement
                  if (target.classList.contains("editable")) {
                    const sectionId = target.getAttribute("data-section")
                    if (sectionId) {
                      startEditing(sectionId, target.textContent || "")
                    }
                  }
                }}
              />

              {/* Editing Modal */}
              {editingSection && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Edit Section</h3>
                      <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full h-40 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Edit your content here..."
                    />
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEdit}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Chat Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium">AI Assistant</span>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full" />
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.type === "user" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-200"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask for changes or questions..."
                className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none text-sm"
              />
              <button
                onClick={sendMessage}
                className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between mt-8"
      >
        <button
          onClick={onPrev}
          className="flex items-center space-x-2 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Outline</span>
        </button>

        <div className="flex space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Create Another Document
          </button>
          <button
            onClick={downloadDocument}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium"
          >
            Download Final Document
          </button>
        </div>
      </motion.div>
    </div>
  )
}
