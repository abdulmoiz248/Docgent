"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MessageCircle, Send, ArrowLeft, RefreshCw } from "lucide-react"
import type { AppState } from "@/app/page"
import { sendChatMessage } from "@/lib/action"
import { generateSectionContent } from "@/lib/content-gen"
import { getTemplate } from "@/lib/document-templates"
import DocumentPreview from "@/components/document-preview"
import type { ChatMessage } from "@/types/document"

interface GenerationStepProps {
  onPrev: () => void
  appState: AppState
  updateAppState: (updates: Partial<AppState>) => void
}

export default function GenerationStep({ onPrev, appState, updateAppState }: GenerationStepProps) {
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
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationStatus, setGenerationStatus] = useState("Analyzing your outline...")

  // Generate document using AI
  const generateDocumentWithAI = async () => {
    const template = getTemplate(appState.documentType || "assignment")
    if (!template) {
      console.error("Template not found")
      return ""
    }

    let documentContent = template.header

    // Add main topic
    const mainTopic = appState.documentData?.topic || appState.basicIdea || "the assigned topic"

    // Add executive summary
    documentContent += `<div class="content-section"><h2>EXECUTIVE SUMMARY</h2>\n<div class="editable" data-section="executive-summary">This ${appState.documentType} explores ${mainTopic}, providing comprehensive analysis and insights into this important subject matter.</div></div>\n\n`

    // Add key points
    if (appState.textPoints && appState.textPoints.length > 0) {
      documentContent += `<div class="content-section"><h2>KEY POINTS</h2>\n<div class="editable" data-section="key-points">`
      appState.textPoints
        .filter((point) => point.trim())
        .forEach((point, index) => {
          documentContent += `${index + 1}. ${point}\n`
        })
      documentContent += `</div></div>\n\n`
    }

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
          mainTopic,
        )

        documentContent += `<div class="content-section"><h2>${section.title.toUpperCase()}</h2>\n`
        documentContent += `<div class="editable" data-section="${section.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}">${aiContent}</div></div>\n\n`
      } catch (error) {
        console.error("Error generating AI content:", error)
        documentContent += `<div class="content-section"><h2>${section.title.toUpperCase()}</h2>\n<div class="editable" data-section="${section.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}">${section.content}\n\nThis section provides comprehensive coverage of ${section.title.toLowerCase()} as it relates to ${mainTopic}.</div></div>\n\n`
      }
    }

    setGenerationProgress(90)
    setGenerationStatus("Finalizing document...")

    // Add conclusion
    documentContent += `<div class="content-section"><h2>CONCLUSION</h2>\n<div class="editable" data-section="conclusion">`
    if (appState.documentType === "assignment") {
      documentContent += `This assignment has provided a comprehensive analysis of ${mainTopic}. Through detailed examination and critical evaluation, key insights have been developed that contribute to a deeper understanding of the subject matter.`
    } else if (appState.documentType === "report") {
      documentContent += `This report presents comprehensive findings and actionable recommendations regarding ${mainTopic}. The analysis conducted provides stakeholders with the necessary information for informed decision-making.`
    } else {
      documentContent += `This document provides a thorough examination of ${mainTopic}, presenting well-researched insights and professional analysis.`
    }
    documentContent += `</div></div>\n\n`

    documentContent += template.footer

    setGenerationProgress(100)
    return documentContent
  }

  useEffect(() => {
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
    } else {
      // Handle general response
      const generalResponse = lines.join("\n").trim()
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

  const downloadDocument = () => {
    if (appState.finalDocument) {
      const template = getTemplate(appState.documentType || "assignment")
      const wordContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${appState.documentType} Document</title>
          <style>${template?.styles || ""}</style>
        </head>
        <body>
          ${appState.finalDocument}
        </body>
        </html>
      `

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
              Using advanced AI to create professional content for your {appState.documentType}
            </p>

            <div className="w-full bg-slate-700 rounded-full h-2.5 mb-6 max-w-md mx-auto">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
              ></div>
            </div>

            <div className="text-slate-300 mb-8">{generationStatus}</div>
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
        <div className="lg:col-span-3">
          <DocumentPreview
            documentType={appState.documentType || "assignment"}
            documentData={appState.documentData}
            finalDocument={appState.finalDocument || ""}
            onDocumentUpdate={(updatedDocument) => updateAppState({ finalDocument: updatedDocument })}
            onDownload={downloadDocument}
          />
        </div>

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
