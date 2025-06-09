"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Upload,
  Plus,
  X,
  ImageIcon,
  ArrowLeft,
  ArrowRight,
  Building,
  User,
  Calendar,
  DollarSign,
  FileText,
  BookOpen,
  BarChart,
} from "lucide-react"
import type { AppState } from "@/app/page"

interface ContentStepProps {
  onNext: () => void
  onPrev: () => void
  appState: AppState
  updateAppState: (updates: Partial<AppState>) => void
}

export default function ContentStep({ onNext, onPrev, appState, updateAppState }: ContentStepProps) {
  const [dragOver, setDragOver] = useState(false)

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    const newImages = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      position: "top",
      description: "",
    }))

    updateAppState({
      images: [...appState.images, ...newImages],
    })
  }

  const removeImage = (id: string) => {
    updateAppState({
      images: appState.images.filter((img) => img.id !== id),
    })
  }

  const addTextPoint = () => {
    updateAppState({
      textPoints: [...appState.textPoints, ""],
    })
  }

  const updateTextPoint = (index: number, value: string) => {
    const newTextPoints = [...appState.textPoints]
    newTextPoints[index] = value
    updateAppState({ textPoints: newTextPoints })
  }

  const removeTextPoint = (index: number) => {
    if (appState.textPoints.length > 1) {
      updateAppState({
        textPoints: appState.textPoints.filter((_, i) => i !== index),
      })
    }
  }

  // Initialize document-specific data structure
  const initializeDocumentData = () => {
    if (!appState.documentData) {
      const defaultData = getDefaultDocumentData()
      updateAppState({ documentData: defaultData })
      return defaultData
    }
    return appState.documentData
  }

  const getDefaultDocumentData = () => {
    switch (appState.documentType) {
      case "invoice":
        return {
          companyName: "",
          companyAddress: "",
          companyEmail: "",
          companyPhone: "",
          clientName: "",
          clientAddress: "",
          clientEmail: "",
          invoiceNumber: "",
          invoiceDate: "",
          dueDate: "",
          items: [{ description: "", quantity: "", rate: "", amount: "" }],
          notes: "",
          paymentTerms: "",
        }
      case "assignment":
        return {
          studentName: "",
          studentId: "",
          courseName: "",
          courseCode: "",
          instructorName: "",
          assignmentTitle: "",
          dueDate: "",
          topic: "",
          requirements: [""],
          sources: [""],
          wordCount: "",
        }
      case "report":
        return {
          reportTitle: "",
          authorName: "",
          organization: "",
          reportDate: "",
          executiveSummary: "",
          objectives: [""],
          methodology: "",
          keyFindings: [""],
          recommendations: [""],
        }
      default: // word-doc
        return {
          documentTitle: "",
          author: "",
          purpose: "",
          audience: "",
          keyPoints: [""],
          mainContent: "",
        }
    }
  }

  const documentData = initializeDocumentData()

  const updateDocumentData = (field: string, value: any) => {
    updateAppState({
      documentData: {
        ...documentData,
        [field]: value,
      },
    })
  }

  const addArrayItem = (field: string) => {
    const currentArray = documentData[field] || []
    updateDocumentData(field, [...currentArray, ""])
  }

  const updateArrayItem = (field: string, index: number, value: string) => {
    const currentArray = [...(documentData[field] || [])]
    currentArray[index] = value
    updateDocumentData(field, currentArray)
  }

  const removeArrayItem = (field: string, index: number) => {
    const currentArray = documentData[field] || []
    if (currentArray.length > 1) {
      updateDocumentData(
        field,
        currentArray.filter((_:any, i:any) => i !== index),
      )
    }
  }

  const canProceed = () => {
    switch (appState.documentType) {
      case "invoice":
        return documentData.companyName && documentData.clientName && documentData.invoiceNumber
      case "assignment":
        return documentData.studentName && documentData.assignmentTitle && documentData.courseName
      case "report":
        return documentData.reportTitle && documentData.authorName && documentData.executiveSummary
      default:
        return documentData.documentTitle && documentData.purpose
    }
  }

  const renderInvoiceForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Your Company Information
          </h4>
          <input
            type="text"
            placeholder="Company Name *"
            value={documentData.companyName || ""}
            onChange={(e) => updateDocumentData("companyName", e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
          />
          <textarea
            placeholder="Company Address"
            value={documentData.companyAddress || ""}
            onChange={(e) => updateDocumentData("companyAddress", e.target.value)}
            className="w-full h-20 bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none resize-none"
          />
          <input
            type="email"
            placeholder="Company Email"
            value={documentData.companyEmail || ""}
            onChange={(e) => updateDocumentData("companyEmail", e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
          />
          <input
            type="tel"
            placeholder="Company Phone"
            value={documentData.companyPhone || ""}
            onChange={(e) => updateDocumentData("companyPhone", e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
          />
        </div>

        {/* Client Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white flex items-center">
            <User className="w-5 h-5 mr-2" />
            Client Information
          </h4>
          <input
            type="text"
            placeholder="Client Name *"
            value={documentData.clientName || ""}
            onChange={(e) => updateDocumentData("clientName", e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
          />
          <textarea
            placeholder="Client Address"
            value={documentData.clientAddress || ""}
            onChange={(e) => updateDocumentData("clientAddress", e.target.value)}
            className="w-full h-20 bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none resize-none"
          />
          <input
            type="email"
            placeholder="Client Email"
            value={documentData.clientEmail || ""}
            onChange={(e) => updateDocumentData("clientEmail", e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Invoice Details */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Invoice Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Invoice Number *"
            value={documentData.invoiceNumber || ""}
            onChange={(e) => updateDocumentData("invoiceNumber", e.target.value)}
            className="bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
          />
          <input
            type="date"
            placeholder="Invoice Date"
            value={documentData.invoiceDate || ""}
            onChange={(e) => updateDocumentData("invoiceDate", e.target.value)}
            className="bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
          />
          <input
            type="date"
            placeholder="Due Date"
            value={documentData.dueDate || ""}
            onChange={(e) => updateDocumentData("dueDate", e.target.value)}
            className="bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-white flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Items/Services
          </h4>
          <button
            onClick={() => addArrayItem("items")}
            className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Item</span>
          </button>
        </div>
        {(documentData.items || []).map((item: any, index: number) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <input
              type="text"
              placeholder="Description"
              value={item.description || ""}
              onChange={(e) => {
                const items = [...(documentData.items || [])]
                items[index] = { ...items[index], description: e.target.value }
                updateDocumentData("items", items)
              }}
              className="md:col-span-2 bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Qty"
              value={item.quantity || ""}
              onChange={(e) => {
                const items = [...(documentData.items || [])]
                items[index] = { ...items[index], quantity: e.target.value }
                updateDocumentData("items", items)
              }}
              className="bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Rate"
              value={item.rate || ""}
              onChange={(e) => {
                const items = [...(documentData.items || [])]
                items[index] = { ...items[index], rate: e.target.value }
                updateDocumentData("items", items)
              }}
              className="bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
            />
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm">
                ${((Number.parseFloat(item.quantity) || 0) * (Number.parseFloat(item.rate) || 0)).toFixed(2)}
              </span>
              {(documentData.items || []).length > 1 && (
                <button
                  onClick={() => removeArrayItem("items", index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Payment Terms */}
      <div className="space-y-4">
        <textarea
          placeholder="Payment Terms & Notes"
          value={documentData.paymentTerms || ""}
          onChange={(e) => updateDocumentData("paymentTerms", e.target.value)}
          className="w-full h-20 bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none resize-none"
        />
      </div>
    </div>
  )

  const renderAssignmentForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white flex items-center">
            <User className="w-5 h-5 mr-2" />
            Student Information
          </h4>
          <input
            type="text"
            placeholder="Student Name *"
            value={documentData.studentName || ""}
            onChange={(e) => updateDocumentData("studentName", e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Student ID"
            value={documentData.studentId || ""}
            onChange={(e) => updateDocumentData("studentId", e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
          />
        </div>

        {/* Course Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Course Information
          </h4>
          <input
            type="text"
            placeholder="Course Name *"
            value={documentData.courseName || ""}
            onChange={(e) => updateDocumentData("courseName", e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Course Code"
            value={documentData.courseCode || ""}
            onChange={(e) => updateDocumentData("courseCode", e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Instructor Name"
            value={documentData.instructorName || ""}
            onChange={(e) => updateDocumentData("instructorName", e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Assignment Details */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Assignment Details
        </h4>
        <input
          type="text"
          placeholder="Assignment Title *"
          value={documentData.assignmentTitle || ""}
          onChange={(e) => updateDocumentData("assignmentTitle", e.target.value)}
          className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            placeholder="Due Date"
            value={documentData.dueDate || ""}
            onChange={(e) => updateDocumentData("dueDate", e.target.value)}
            className="bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Word Count (optional)"
            value={documentData.wordCount || ""}
            onChange={(e) => updateDocumentData("wordCount", e.target.value)}
            className="bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
          />
        </div>
        <textarea
          placeholder="Topic/Research Question"
          value={documentData.topic || ""}
          onChange={(e) => updateDocumentData("topic", e.target.value)}
          className="w-full h-24 bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none resize-none"
        />
      </div>

      {/* Requirements */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-white">Requirements</h4>
          <button
            onClick={() => addArrayItem("requirements")}
            className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Requirement</span>
          </button>
        </div>
        {(documentData.requirements || []).map((req: string, index: number) => (
          <div key={index} className="flex items-center space-x-3">
            <input
              type="text"
              placeholder={`Requirement ${index + 1}...`}
              value={req}
              onChange={(e) => updateArrayItem("requirements", index, e.target.value)}
              className="flex-1 bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
            />
            {(documentData.requirements || []).length > 1 && (
              <button
                onClick={() => removeArrayItem("requirements", index)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderReportForm = () => (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white flex items-center">
          <BarChart className="w-5 h-5 mr-2" />
          Report Information
        </h4>
        <input
          type="text"
          placeholder="Report Title *"
          value={documentData.reportTitle || ""}
          onChange={(e) => updateDocumentData("reportTitle", e.target.value)}
          className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Author Name *"
            value={documentData.authorName || ""}
            onChange={(e) => updateDocumentData("authorName", e.target.value)}
            className="bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Organization"
            value={documentData.organization || ""}
            onChange={(e) => updateDocumentData("organization", e.target.value)}
            className="bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
          />
          <input
            type="date"
            placeholder="Report Date"
            value={documentData.reportDate || ""}
            onChange={(e) => updateDocumentData("reportDate", e.target.value)}
            className="bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Executive Summary */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Executive Summary</h4>
        <textarea
          placeholder="Brief overview of the report's key findings and recommendations *"
          value={documentData.executiveSummary || ""}
          onChange={(e) => updateDocumentData("executiveSummary", e.target.value)}
          className="w-full h-32 bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none resize-none"
        />
      </div>

      {/* Objectives */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-white">Objectives</h4>
          <button
            onClick={() => addArrayItem("objectives")}
            className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Objective</span>
          </button>
        </div>
        {(documentData.objectives || []).map((obj: string, index: number) => (
          <div key={index} className="flex items-center space-x-3">
            <input
              type="text"
              placeholder={`Objective ${index + 1}...`}
              value={obj}
              onChange={(e) => updateArrayItem("objectives", index, e.target.value)}
              className="flex-1 bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
            />
            {(documentData.objectives || []).length > 1 && (
              <button
                onClick={() => removeArrayItem("objectives", index)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Key Findings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-white">Key Findings</h4>
          <button
            onClick={() => addArrayItem("keyFindings")}
            className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Finding</span>
          </button>
        </div>
        {(documentData.keyFindings || []).map((finding: string, index: number) => (
          <div key={index} className="flex items-center space-x-3">
            <input
              type="text"
              placeholder={`Key finding ${index + 1}...`}
              value={finding}
              onChange={(e) => updateArrayItem("keyFindings", index, e.target.value)}
              className="flex-1 bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
            />
            {(documentData.keyFindings || []).length > 1 && (
              <button
                onClick={() => removeArrayItem("keyFindings", index)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderWordDocForm = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Document Information
        </h4>
        <input
          type="text"
          placeholder="Document Title *"
          value={documentData.documentTitle || ""}
          onChange={(e) => updateDocumentData("documentTitle", e.target.value)}
          className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Author"
            value={documentData.author || ""}
            onChange={(e) => updateDocumentData("author", e.target.value)}
            className="bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Target Audience"
            value={documentData.audience || ""}
            onChange={(e) => updateDocumentData("audience", e.target.value)}
            className="bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
          />
        </div>
        <textarea
          placeholder="Purpose of the document *"
          value={documentData.purpose || ""}
          onChange={(e) => updateDocumentData("purpose", e.target.value)}
          className="w-full h-24 bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none resize-none"
        />
      </div>

      {/* Key Points */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-white">Key Points</h4>
          <button
            onClick={() => addArrayItem("keyPoints")}
            className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Point</span>
          </button>
        </div>
        {(documentData.keyPoints || []).map((point: string, index: number) => (
          <div key={index} className="flex items-center space-x-3">
            <input
              type="text"
              placeholder={`Key point ${index + 1}...`}
              value={point}
              onChange={(e) => updateArrayItem("keyPoints", index, e.target.value)}
              className="flex-1 bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
            />
            {(documentData.keyPoints || []).length > 1 && (
              <button
                onClick={() => removeArrayItem("keyPoints", index)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Main Content</h4>
        <textarea
          placeholder="Describe the main content you want to include..."
          value={documentData.mainContent || ""}
          onChange={(e) => updateDocumentData("mainContent", e.target.value)}
          className="w-full h-32 bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none resize-none"
        />
      </div>
    </div>
  )

  const renderDocumentSpecificForm = () => {
    switch (appState.documentType) {
      case "invoice":
        return renderInvoiceForm()
      case "assignment":
        return renderAssignmentForm()
      case "report":
        return renderReportForm()
      default:
        return renderWordDocForm()
    }
  }

  const getDocumentTypeTitle = () => {
    switch (appState.documentType) {
      case "invoice":
        return "invoice details"
      case "assignment":
        return "assignment information"
      case "report":
        return "report details"
      default:
        return "document content"
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Let's gather your {getDocumentTypeTitle()}</h2>
        <p className="text-slate-400">Fill in the information needed for your {appState.documentType}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document-Specific Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
            {renderDocumentSpecificForm()}
          </div>
        </motion.div>

        {/* Image Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-white flex items-center">
            <ImageIcon className="w-5 h-5 mr-2" />
            Images (Optional)
          </h3>

          <div
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
              dragOver ? "border-blue-400 bg-blue-500/10" : "border-slate-600 hover:border-slate-500"
            }`}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              handleFileUpload(e.dataTransfer.files)
            }}
          >
            <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-white mb-2 text-sm">Drop images here</p>
            <p className="text-slate-400 text-xs mb-3">PNG, JPG up to 10MB</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-sm"
            >
              Choose Files
            </label>
          </div>

          {/* Uploaded Images */}
          {appState.images.length > 0 && (
            <div className="space-y-3">
              {appState.images.map((image) => (
                <div key={image.id} className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={URL.createObjectURL(image.file) || "/placeholder.svg"}
                        alt={image.file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-white text-xs font-medium truncate">{image.file.name}</p>
                      <select
                        value={image.position}
                        onChange={(e) => {
                          const updatedImages = appState.images.map((img) =>
                            img.id === image.id ? { ...img, position: e.target.value } : img,
                          )
                          updateAppState({ images: updatedImages })
                        }}
                        className="w-full text-xs bg-slate-700 text-slate-300 rounded px-2 py-1 border border-slate-600 focus:border-blue-400 focus:outline-none"
                      >
                        <option value="top">Top of document</option>
                        <option value="introduction">Introduction</option>
                        <option value="main-content">Main content</option>
                        <option value="conclusion">Conclusion</option>
                        <option value="bottom">Bottom</option>
                      </select>
                      <input
                        type="text"
                        value={image.description}
                        onChange={(e) => {
                          const updatedImages = appState.images.map((img) =>
                            img.id === image.id ? { ...img, description: e.target.value } : img,
                          )
                          updateAppState({ images: updatedImages })
                        }}
                        placeholder="Image description..."
                        className="w-full text-xs bg-slate-700 text-slate-300 rounded px-2 py-1 border border-slate-600 focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => removeImage(image.id)}
                      className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between mt-12"
      >
        <button
          onClick={onPrev}
          className="flex items-center space-x-2 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={onNext}
          disabled={!canProceed()}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
            canProceed()
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
              : "bg-slate-700 text-slate-400 cursor-not-allowed"
          }`}
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  )
}
