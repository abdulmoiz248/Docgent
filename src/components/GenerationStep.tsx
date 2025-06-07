"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Download, MessageCircle, Send, ArrowLeft, RefreshCw, FileText } from "lucide-react"
import type { AppState } from "@/app/page"

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

export default function GenerationStep({ onPrev, appState, updateAppState }: GenerationStepProps) {
  const [isGenerating, setIsGenerating] = useState(true)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content: "Hi! I'm here to help you refine your document. What changes would you like to make?",
      timestamp: new Date(),
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [imageDataUrls, setImageDataUrls] = useState<{ [key: string]: string }>({})

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
              // Set canvas size to image size (or max 800px width)
              const maxWidth = 800
              const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
              canvas.width = img.width * ratio
              canvas.height = img.height * ratio

              // Draw image to canvas
              ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)

              // Convert to base64
              dataUrls[image.id] = canvas.toDataURL("image/jpeg", 0.8)
              resolve(null)
            }
            img.onerror = reject
            img.crossOrigin = "anonymous"
            img.src = URL.createObjectURL(image.file)
          })
        } catch (error) {
          console.error("Error converting image:", error)
          // Fallback to blob URL
          dataUrls[image.id] = URL.createObjectURL(image.file)
        }
      }

      setImageDataUrls(dataUrls)
    }

    if (appState.images.length > 0) {
      convertImagesToBase64()
    }
  }, [appState.images])

  useEffect(() => {
    // Simulate document generation
    setTimeout(() => {
      const generateDocumentWithImages = () => {
        let documentContent = `${appState.documentType?.replace("-", " ").toUpperCase()} DOCUMENT\n\n`

        // Add top images
        const topImages = appState.images.filter((img) => img.position === "top")
        if (topImages.length > 0) {
          documentContent += "=== IMAGES ===\n"
          topImages.forEach((img) => {
            documentContent += `IMAGE:${img.id}:${img.file.name}:${img.description || "No description"}\n`
          })
          documentContent += "\n"
        }

        documentContent += `EXECUTIVE SUMMARY\n${appState.basicIdea}\n\n`

        documentContent += `KEY POINTS\n`
        appState.textPoints
          .filter((point) => point.trim())
          .forEach((point, index) => {
            documentContent += `${index + 1}. ${point}\n`
          })
        documentContent += "\n"

        // Add sections with their images
        appState.outline.forEach((section, index) => {
          documentContent += `${section.title.toUpperCase()}\n\n`

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
            documentContent += "--- Images in this section ---\n"
            sectionImages.forEach((img) => {
              documentContent += `IMAGE:${img.id}:${img.file.name}:${img.description || "No description provided"}\n`
            })
            documentContent += "\n"
          }

          documentContent += `${section.content}\n\n`
          documentContent += `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n`
        })

        // Add bottom images
        const bottomImages = appState.images.filter((img) => img.position === "bottom")
        if (bottomImages.length > 0) {
          documentContent += "=== ADDITIONAL IMAGES ===\n"
          bottomImages.forEach((img) => {
            documentContent += `IMAGE:${img.id}:${img.file.name}:${img.description || "No description"}\n`
          })
          documentContent += "\n"
        }

        documentContent += `CONCLUSION\n\nThis document provides a comprehensive overview of the ${appState.documentType} requirements and specifications. All sections have been carefully structured to ensure clarity and professional presentation.\n\n`
        documentContent += `---\nDocument generated by Docgent AI on ${new Date().toLocaleDateString()}\nProfessional Document Generation Platform`

        return documentContent
      }

      const mockDocument = generateDocumentWithImages()
      updateAppState({ finalDocument: mockDocument })
      setIsGenerating(false)
    }, 3000)
  }, [appState, updateAppState])

  const sendMessage = () => {
    if (!chatInput.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: chatInput,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "I understand your request. Let me help you make those changes to your document.",
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  const downloadDocument = () => {
    if (appState.finalDocument) {
      // Create a proper Word document structure with embedded images
      let wordContent = `
<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${appState.documentType?.toUpperCase()} Document</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>90</w:Zoom>
      <w:DoNotPromptForConvert/>
      <w:DoNotShowInsertionsAndDeletions/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page { margin: 1in; }
    body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; }
    h1 { font-size: 18pt; font-weight: bold; text-align: center; margin-bottom: 20pt; }
    h2 { font-size: 14pt; font-weight: bold; margin-top: 16pt; margin-bottom: 8pt; }
    h3 { font-size: 12pt; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt; }
    p { margin-bottom: 12pt; text-align: justify; }
    ul { margin-left: 20pt; }
    li { margin-bottom: 6pt; }
    .document-image { 
      max-width: 100%; 
      height: auto; 
      margin: 15px 0; 
      display: block;
      border: 1px solid #ddd;
      padding: 5px;
    }
    .image-caption {
      font-style: italic;
      font-size: 10pt;
      color: #666;
      text-align: center;
      margin-bottom: 15px;
    }
  </style>
</head>
<body>
  <h1>${appState.documentType?.replace("-", " ").toUpperCase()} DOCUMENT</h1>
  `

      // Process the document content and replace image placeholders with actual images
      const lines = appState.finalDocument.split("\n")

      for (const line of lines) {
        if (line.startsWith("IMAGE:")) {
          // Parse image info: IMAGE:id:filename:description
          const parts = line.split(":")
          if (parts.length >= 4) {
            const imageId = parts[1]
            const filename = parts[2]
            const description = parts.slice(3).join(":")

            if (imageDataUrls[imageId]) {
              wordContent += `
                <div style="text-align: center; margin: 20px 0;">
                  <img src="${imageDataUrls[imageId]}" class="document-image" alt="${filename}" />
                  <div class="image-caption">${filename}${description ? ` - ${description}` : ""}</div>
                </div>
              `
            }
          }
        } else if (line.includes("===")) {
          wordContent += `<h2>${line.replace(/=/g, "").trim()}</h2>`
        } else if (line.includes("---")) {
          wordContent += `<h3>${line.replace(/-/g, "").trim()}</h3>`
        } else if (line.trim() === "") {
          wordContent += `<br>`
        } else if (line.includes("EXECUTIVE SUMMARY") || line.includes("KEY POINTS") || line.includes("CONCLUSION")) {
          wordContent += `<h2>${line}</h2>`
        } else if (line.match(/^\d+\./)) {
          if (!wordContent.includes("<ul>")) {
            wordContent += `<ul>`
          }
          wordContent += `<li>${line.replace(/^\d+\.\s*/, "")}</li>`
        } else if (line.trim() && !line.includes("Document generated by")) {
          if (wordContent.includes("<ul>") && !line.match(/^\d+\./)) {
            wordContent += `</ul>`
          }
          wordContent += `<p>${line}</p>`
        }
      }

      if (wordContent.includes("<ul>")) {
        wordContent += `</ul>`
      }

      wordContent += `
  <br><br>
  <p><em>This document was generated using Docgent AI on ${new Date().toLocaleDateString()}.</em></p>
</body>
</html>`

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
            <h2 className="text-3xl font-bold text-white mb-4">Generating your document...</h2>
            <p className="text-slate-400 mb-6">
              AI is crafting your {appState.documentType} with all your specifications
            </p>

            {/* Progress indicators */}
            <div className="max-w-md mx-auto space-y-3">
              {[
                "Processing your content...",
                "Converting images...",
                "Structuring the document...",
                "Adding final touches...",
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.6 }}
                  className="flex items-center space-x-3 text-slate-300"
                >
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
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
        <h2 className="text-3xl font-bold text-white mb-2">Your document is ready!</h2>
        <p className="text-slate-400">Review your generated {appState.documentType} and make any final adjustments</p>
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
                <span className="text-white font-medium">Document Preview</span>
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
              <div className="prose prose-sm max-w-none">
                {appState.finalDocument?.split("\n").map((line, index) => {
                  if (line.startsWith("IMAGE:")) {
                    // Parse image info: IMAGE:id:filename:description
                    const parts = line.split(":")
                    if (parts.length >= 4) {
                      const imageId = parts[1]
                      const filename = parts[2]
                      const description = parts.slice(3).join(":")
                      const imageUrl =
                        imageDataUrls[imageId] ||
                        URL.createObjectURL(appState.images.find((img) => img.id === imageId)?.file!)

                      return (
                        <div key={index} className="my-6 text-center">
                          <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                            <img
                              src={imageUrl || "/placeholder.svg"}
                              alt={filename}
                              className="max-w-full h-auto mx-auto rounded shadow-md"
                              style={{ maxHeight: "300px" }}
                            />
                            <div className="mt-3 text-sm text-gray-600">
                              <div className="font-medium">{filename}</div>
                              {description && <div className="italic">{description}</div>}
                            </div>
                          </div>
                        </div>
                      )
                    }
                  } else if (line.includes("===")) {
                    return (
                      <h3
                        key={index}
                        className="text-lg font-bold text-blue-600 mt-6 mb-3 border-b-2 border-blue-200 pb-1"
                      >
                        {line.replace(/=/g, "").trim()}
                      </h3>
                    )
                  } else if (line.includes("---")) {
                    return (
                      <h4 key={index} className="text-md font-semibold text-purple-600 mt-4 mb-2">
                        {line.replace(/-/g, "").trim()}
                      </h4>
                    )
                  } else if (line.trim() === "") {
                    return <br key={index} />
                  } else {
                    return (
                      <p key={index} className="text-gray-800 mb-2 leading-relaxed">
                        {line}
                      </p>
                    )
                  }
                })}
              </div>
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
                placeholder="Ask for changes..."
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
