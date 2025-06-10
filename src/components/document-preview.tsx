"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { FileText, Download } from "lucide-react"
import { getTemplate } from "@/lib/document-templates"
import DocumentEditorModal from "./document-editor-modal"

interface DocumentPreviewProps {
  documentType: string
  documentData: any
  finalDocument: string
  onDocumentUpdate: (updatedDocument: string) => void
  onDownload: () => void
}

export default function DocumentPreview({
  documentType,
  documentData,
  finalDocument,
  onDocumentUpdate,
  onDownload,
}: DocumentPreviewProps) {
  const [editingSection, setEditingSection] = useState<{
    id: string
    title: string
    content: string
  } | null>(null)
  const [lastTap, setLastTap] = useState(0)
  const previewRef = useRef<HTMLDivElement>(null)

  const template = getTemplate(documentType)

  const handleDoubleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.classList.contains("editable")) {
      const sectionId = target.getAttribute("data-section")
      const sectionTitle = target.closest(".content-section")?.querySelector("h2")?.textContent || "Section"

      if (sectionId) {
        setEditingSection({
          id: sectionId,
          title: sectionTitle,
          content: target.textContent || "",
        })
      }
    }
  }

  // Handle mobile double-tap
  const handleTouchEnd = (e: React.TouchEvent) => {
    const currentTime = new Date().getTime()
    const tapLength = currentTime - lastTap

    if (tapLength < 500 && tapLength > 0) {
      // Double tap detected
      const target = e.target as HTMLElement
      if (target.classList.contains("editable")) {
        const sectionId = target.getAttribute("data-section")
        const sectionTitle = target.closest(".content-section")?.querySelector("h2")?.textContent || "Section"

        if (sectionId) {
          setEditingSection({
            id: sectionId,
            title: sectionTitle,
            content: target.textContent || "",
          })
        }
      }
    }
    setLastTap(currentTime)
  }

  const handleSaveEdit = (newContent: string) => {
    if (editingSection && finalDocument) {
      const updatedDocument = finalDocument.replace(
        new RegExp(`(<div class="editable" data-section="${editingSection.id}">)([^<]*)(</div>)`, "gi"),
        `$1${newContent}$3`,
      )
      onDocumentUpdate(updatedDocument)
      setEditingSection(null)
    }
  }

  const renderDocument = () => {
    if (!template || !finalDocument) return null

    // Replace template variables with actual data
    let processedDocument = finalDocument

    if (documentData) {
      Object.entries(documentData).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`
        processedDocument = processedDocument.replace(
          new RegExp(placeholder, "g"),
          (value as string) || `[Enter ${key}]`,
        )
      })
    }

    // Add current date
    processedDocument = processedDocument.replace(/{{submissionDate}}/g, new Date().toLocaleDateString())
    processedDocument = processedDocument.replace(/{{reportDate}}/g, new Date().toLocaleDateString())
    processedDocument = processedDocument.replace(/{{proposalDate}}/g, new Date().toLocaleDateString())

    return (
      <div className="document-preview">
        <style dangerouslySetInnerHTML={{ __html: template.styles }} />
        <div
          dangerouslySetInnerHTML={{ __html: processedDocument }}
          onDoubleClick={handleDoubleClick}
          onTouchEnd={handleTouchEnd}
        />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-slate-800/30 backdrop-blur-sm border text-black border-slate-700 rounded-2xl p-6 h-[600px] overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <span className="text-white font-medium">Document Preview (Double-click to Edit)</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div ref={previewRef} className="bg-white rounded-lg p-6 h-full overflow-y-auto shadow-inner">
        {renderDocument()}
      </div>

      {/* Edit Modal */}
      <DocumentEditorModal
        isOpen={!!editingSection}
        onClose={() => setEditingSection(null)}
        onSave={handleSaveEdit}
        sectionTitle={editingSection?.title || ""}
        initialContent={editingSection?.content || ""}
      />
    </motion.div>
  )
}
