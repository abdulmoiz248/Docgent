"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { GripVertical, Edit2, Check, X, ArrowLeft, ArrowRight, Plus } from "lucide-react"
import type { AppState } from "@/app/page"

interface OutlineStepProps {
  onNext: () => void
  onPrev: () => void
  appState: AppState
  updateAppState: (updates: Partial<AppState>) => void
}

export default function OutlineStep({ onNext, onPrev, appState, updateAppState }: OutlineStepProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [isGenerating, setIsGenerating] = useState(true)

  useEffect(() => {
    // Simulate outline generation
    const generateOutline = () => {
      const outlineTemplates = {
        invoice: [
          {
            id: "1",
            title: "Header & Company Information",
            content: "Company details, logo, contact information",
            hasImages: false,
          },
          { id: "2", title: "Client Information", content: "Billing address and client details", hasImages: false },
          { id: "3", title: "Invoice Details", content: "Invoice number, date, due date", hasImages: false },
          {
            id: "4",
            title: "Itemized Services/Products",
            content: "Description, quantity, rate, amount",
            hasImages: false,
          },
          {
            id: "5",
            title: "Total & Payment Terms",
            content: "Subtotal, taxes, total amount, payment instructions",
            hasImages: false,
          },
        ],
        "word-doc": [
          { id: "1", title: "Introduction", content: "Opening statement and purpose", hasImages: false },
          { id: "2", title: "Main Content", content: "Core information and key points", hasImages: false },
          { id: "3", title: "Supporting Details", content: "Additional context and examples", hasImages: false },
          { id: "4", title: "Conclusion", content: "Summary and closing remarks", hasImages: false },
        ],
        assignment: [
          { id: "1", title: "Title Page", content: "Assignment title, student name, course, date", hasImages: false },
          { id: "2", title: "Introduction", content: "Topic introduction and thesis statement", hasImages: false },
          { id: "3", title: "Literature Review", content: "Research and background information", hasImages: false },
          { id: "4", title: "Main Arguments", content: "Key points and supporting evidence", hasImages: false },
          {
            id: "5",
            title: "Analysis & Discussion",
            content: "Critical analysis and interpretation",
            hasImages: false,
          },
          { id: "6", title: "Conclusion", content: "Summary and final thoughts", hasImages: false },
          { id: "7", title: "References", content: "Bibliography and citations", hasImages: false },
        ],
        report: [
          { id: "1", title: "Executive Summary", content: "Brief overview of key findings", hasImages: false },
          { id: "2", title: "Introduction", content: "Purpose, scope, and methodology", hasImages: false },
          { id: "3", title: "Findings", content: "Data analysis and key discoveries", hasImages: false },
          { id: "4", title: "Discussion", content: "Interpretation of results", hasImages: false },
          { id: "5", title: "Recommendations", content: "Suggested actions and next steps", hasImages: false },
          { id: "6", title: "Appendices", content: "Supporting documents and data", hasImages: false },
        ],
      }

      setTimeout(() => {
        let outline = outlineTemplates[appState.documentType!] || outlineTemplates["word-doc"]

        // Add image information to sections
        outline = outline.map((section) => {
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

          return {
            ...section,
            hasImages: sectionImages.length > 0,
            imageCount: sectionImages.length,
            content:
              sectionImages.length > 0
                ? `${section.content} (${sectionImages.length} image${sectionImages.length > 1 ? "s" : ""} included)`
                : section.content,
          }
        })

        updateAppState({ outline })
        setIsGenerating(false)
      }, 2000)
    }

    if (appState.outline.length === 0) {
      generateOutline()
    } else {
      setIsGenerating(false)
    }
  }, [appState.documentType, appState.outline.length, updateAppState])

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(appState.outline)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    updateAppState({ outline: items })
  }

  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id)
    setEditValue(currentTitle)
  }

  const saveEdit = () => {
    if (editingId) {
      const updatedOutline = appState.outline.map((item) =>
        item.id === editingId ? { ...item, title: editValue } : item,
      )
      updateAppState({ outline: updatedOutline })
      setEditingId(null)
      setEditValue("")
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue("")
  }

  if (isGenerating) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
              />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Generating your outline...</h2>
            <p className="text-slate-400">AI is creating a structured outline based on your content</p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Review your document outline</h2>
        <p className="text-slate-400">Drag to reorder sections or click to edit titles</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-8"
      >
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="outline">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {appState.outline.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-slate-800/50 border border-slate-600 rounded-lg p-4 transition-all duration-200 ${
                          snapshot.isDragging ? "shadow-2xl scale-105" : "hover:border-slate-500"
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div
                            {...provided.dragHandleProps}
                            className="mt-1 text-slate-400 hover:text-slate-300 cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical className="w-5 h-5" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              {editingId === item.id ? (
                                <div className="flex items-center space-x-2 flex-1">
                                  <input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white focus:border-blue-400 focus:outline-none"
                                    autoFocus
                                  />
                                  <button onClick={saveEdit} className="text-green-400 hover:text-green-300">
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button onClick={cancelEdit} className="text-red-400 hover:text-red-300">
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-center space-x-2">
                                    <h3 className="text-lg font-semibold text-white">
                                      {index + 1}. {item.title}
                                    </h3>
                                    {item.imageCount > 0 && (
                                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                                        📷 {item.imageCount}
                                      </span>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => startEditing(item.id, item.title)}
                                    className="text-slate-400 hover:text-slate-300 transition-colors"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                            <p className="text-slate-400 text-sm">{item.content}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </motion.div>

      {/* Add New Section Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-6"
      >
        <button
          onClick={() => {
            const newSection = {
              id: Math.random().toString(36).substr(2, 9),
              title: "New Section",
              content: "Add your content description here",
            }
            updateAppState({
              outline: [...appState.outline, newSection],
            })
            setEditingId(newSection.id)
            setEditValue("New Section")
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 mx-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Section</span>
        </button>
      </motion.div>

      {/* Approval Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center mb-8"
      >
        <p className="text-white text-lg mb-6">Does this outline look good to you?</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onNext}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium"
          >
            Yes, looks perfect!
          </button>
          <button
            onClick={() => {
              // Add a new section to the outline
              const newSection = {
                id: Math.random().toString(36).substr(2, 9),
                title: "New Section",
                content: "Add your content description here",
              }
              updateAppState({
                outline: [...appState.outline, newSection],
              })
              // Start editing the new section immediately
              setEditingId(newSection.id)
              setEditValue("New Section")
            }}
            className="px-8 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors font-medium"
          >
            No, let me add more sections
          </button>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-between"
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
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
        >
          <span>Generate Document</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  )
}
