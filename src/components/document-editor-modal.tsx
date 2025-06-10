"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Save, Bold, Italic, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface DocumentEditorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (content: string) => void
  sectionTitle: string
  initialContent: string
}

export default function DocumentEditorModal({
  isOpen,
  onClose,
  onSave,
  sectionTitle,
  initialContent,
}: DocumentEditorModalProps) {
  const [content, setContent] = useState(initialContent)
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      onSave(content.trim())
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setContent(initialContent)
    onClose()
  }

  const formatText = (format: string) => {
    const textarea = document.getElementById("content-editor") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    let formattedText = selectedText
    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`
        break
      case "italic":
        formattedText = `*${selectedText}*`
        break
      case "list":
        formattedText = selectedText
          .split("\n")
          .map((line) => `• ${line}`)
          .join("\n")
        break
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end)
    setContent(newContent)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 flex-shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Edit Section</h2>
                <p className="text-gray-600 mt-1">{sectionTitle}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => formatText("bold")}
                  className="flex items-center space-x-1"
                >
                  <Bold className="w-4 h-4" />
                  <span>Bold</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => formatText("italic")}
                  className="flex items-center space-x-1"
                >
                  <Italic className="w-4 h-4" />
                  <span>Italic</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => formatText("list")}
                  className="flex items-center space-x-1"
                >
                  <List className="w-4 h-4" />
                  <span>List</span>
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant={isPreview ? "default" : "outline"} size="sm" onClick={() => setIsPreview(!isPreview)}>
                  {isPreview ? "Edit" : "Preview"}
                </Button>
              </div>
            </div>

            {/* Content Area - Scrollable */}
            <div className="flex-1 overflow-hidden">
              {isPreview ? (
                <div className="h-full overflow-y-auto prose prose-sm max-w-none bg-gray-50 p-6">
                  <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br>") }} />
                </div>
              ) : (
                <div className="h-full p-6">
                  <Textarea
                    id="content-editor"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-full resize-none border-0 focus:ring-0 text-base leading-relaxed"
                    placeholder="Enter your content here..."
                  />
                </div>
              )}
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="text-sm text-gray-500">
                {content.length} characters • {content.split(/\s+/).filter((word) => word.length > 0).length} words
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
