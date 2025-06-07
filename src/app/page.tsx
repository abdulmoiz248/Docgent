"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import WelcomeStep from "@/components/WelcomeStep"
import ContentStep from "@/components/ContentStep"
import OutlineStep from "@/components/OutlineStep"
import GenerationStep from "@/components/GenerationStep"
import StepIndicator from "@/components/StepIndicator"

export type DocumentType = "invoice" | "word-doc" | "assignment" | "report"

export interface AppState {
  documentType: DocumentType | null
  images: Array<{ id: string; file: File; position: string; description: string }>
  textPoints: string[]
  basicIdea: string
  outline: Array<{ id: string; title: string; content: string; hasImages?: boolean; imageCount?: number }>
  finalDocument: string | null
  documentData?: any // Document-specific data structure
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1)
  const [appState, setAppState] = useState<AppState>({
    documentType: null,
    images: [],
    textPoints: [""],
    basicIdea: "",
    outline: [],
    finalDocument: null,
  })

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateAppState = (updates: Partial<AppState>) => {
    setAppState((prev) => ({ ...prev, ...updates }))
  }

  const stepVariants = {
    enter: { opacity: 0, x: 100, scale: 0.95 },
    center: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -100, scale: 0.95 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/10 to-pink-500/5" />

      {/* Animated background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Enhanced Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-4 tracking-tight">Docgent</h1>
          <p className="text-slate-400 text-xl font-light tracking-wide">AI-Powered Document Generation Platform</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Step Content */}
        <div className="mt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "spring",
                stiffness: 100,
              }}
            >
              {currentStep === 1 && (
                <WelcomeStep onNext={nextStep} appState={appState} updateAppState={updateAppState} />
              )}
              {currentStep === 2 && (
                <ContentStep onNext={nextStep} onPrev={prevStep} appState={appState} updateAppState={updateAppState} />
              )}
              {currentStep === 3 && (
                <OutlineStep onNext={nextStep} onPrev={prevStep} appState={appState} updateAppState={updateAppState} />
              )}
              {currentStep === 4 && (
                <GenerationStep onPrev={prevStep} appState={appState} updateAppState={updateAppState} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
